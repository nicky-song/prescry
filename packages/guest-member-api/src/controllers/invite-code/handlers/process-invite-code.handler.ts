// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import moment from 'moment-timezone';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IProcessInviteCodeResponseData } from '@phx/common/src/models/api-response/process-invite-code.response';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import {
  IProviderLocation,
  IService,
} from '@phx/common/src/models/provider-location';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IConfiguration } from '../../../configuration';
import { badRequestForInviteCodeResponse } from '../helpers/bad-request-response.helper';
import { getWaitListByIdentifier } from '../../../databases/mongo-database/v1/query-helper/wait-list.query-helper';
import { IServices } from '../../../models/services';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { ApiConstants } from '../../../constants/api-constants';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { convertOutlookTimezoneToIANATimezone } from '../../provider-location/helpers/appointment-timezone.helper';
import { buildProviderLocationDetails } from '../../provider-location/helpers/provider-location-details-map.helper';
import { IAvailableBookingSlotsResponse } from '../../../models/pharmacy-portal/get-available-booking-slots.response';
import {
  convertToBookingAvailability,
  getAvailableBookingSlotsEndpointHelper,
} from '../../provider-location/helpers/get-available-booking-slots-endpoint.helper';
import { IGetAvailableBookingSlotsRequest } from '../../../models/pharmacy-portal/get-available-booking-slots.request';
import { getSlotsAndUnavailableDays } from '../../provider-location/helpers/get-slots-and-unavailable-days';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { IProviderLocationResponse } from '../../../models/pharmacy-portal/get-provider-location.response';
import { getProviderLocationByIdAndServiceType } from '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper';

export async function processInviteCodeHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  try {
    const inviteCode = request.params.code;
    if (!inviteCode) {
      return badRequestForInviteCodeResponse(
        response,
        ErrorConstants.INVITE_CODE_MISSING,
        InternalResponseCode.INVITE_CODE_MISSING
      );
    }

    const inviteCodeDetails = await getWaitListByIdentifier(
      database,
      inviteCode
    );
    if (!inviteCodeDetails) {
      return badRequestForInviteCodeResponse(
        response,
        ErrorConstants.INVITE_CODE_EXPIRED,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
    }

    const {
      invitation,
      location: locationId,
      phoneNumber,
      serviceType,
      status,
    } = inviteCodeDetails;

    const account = getRequiredResponseLocal(response, 'account');
    const userPhoneNumber = account.phoneNumber;

    if (userPhoneNumber !== phoneNumber) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.UNAUTHORIZED_REQUEST,
        ErrorConstants.INVITE_CODE_INVALID_PHONE_NUMBER,
        undefined,
        InternalResponseCode.INVITE_CODE_INVALID_PHONE_NUMBER
      );
    }

    if (status !== 'invited' || !invitation) {
      return badRequestForInviteCodeResponse(
        response,
        ErrorConstants.INVITE_CODE_ALREADY_USED,
        InternalResponseCode.INVITE_CODE_ALREADY_USED
      );
    }

    const currentTime = moment.utc();
    if (moment(invitation.end).isBefore(currentTime)) {
      return badRequestForInviteCodeResponse(
        response,
        ErrorConstants.INVITE_CODE_EXPIRED,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
    }

    if (!locationId) {
      return badRequestForInviteCodeResponse(
        response,
        ErrorConstants.INVITE_CODE_EXPIRED,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
    }

    const providerLocationResponse: IProviderLocationResponse =
      await getProviderLocationByIdAndServiceType(
        configuration,
        locationId,
        serviceType
      );

    if (!providerLocationResponse) {
      return badRequestForInviteCodeResponse(
        response,
        ErrorConstants.INVITE_CODE_EXPIRED,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
    }
    const providerLocation: IProviderLocation | undefined =
      providerLocationResponse.location;
    if (!providerLocation) {
      return badRequestForInviteCodeResponse(
        response,
        ErrorConstants.INVITE_CODE_EXPIRED,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
    }
    const serviceTypeDetails: IServices | undefined =
      providerLocationResponse.service;
    if (!serviceTypeDetails) {
      return badRequestForInviteCodeResponse(
        response,
        ErrorConstants.INVALID_SERVICE_TYPE,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
    }

    const minAgeScheduler =
      serviceTypeDetails.schedulerMinimumAge ||
      ApiConstants.SCHEDULER_MIN_AGE_LIMIT;

    if (
      !account.dateOfBirth ||
      CalculateAbsoluteAge(new Date(), account.dateOfBirth) < minAgeScheduler
    ) {
      return badRequestForInviteCodeResponse(
        response,
        StringFormatter.format(
          ErrorConstants.DEEP_LINK_SCHEDULER_AGE_REQUIREMENT_NOT_MET,
          new Map<string, string>([
            ['ageRequirement', minAgeScheduler.toString()],
            ['serviceName', serviceTypeDetails.serviceName],
            ['supportEmail', configuration.supportEmail],
          ])
        ),
        InternalResponseCode.SCHEDULER_AGE_REQUIREMENT_NOT_MET
      );
    }
    const selectedService = providerLocation.serviceList?.find(
      (s: IService) => s.serviceType === serviceType
    );

    if (!selectedService || selectedService.status === 'off') {
      return badRequestForInviteCodeResponse(
        response,
        ErrorConstants.INVALID_SERVICE_TYPE,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
    }

    const minDaysDuration = moment.duration(selectedService.minLeadDays);
    const currentTimeMoment = moment
      .tz(
        currentTime,
        convertOutlookTimezoneToIANATimezone(providerLocation.timezone)
      )
      .add(minDaysDuration)
      .startOf('day');

    const startTimeMoment = moment.tz(
      invitation.start,
      convertOutlookTimezoneToIANATimezone(providerLocation.timezone)
    );
    const startMoment = startTimeMoment.isBefore(currentTimeMoment)
      ? currentTimeMoment
      : startTimeMoment;
    const endOfMonthMoment = startMoment.clone().endOf('month');
    const start = startMoment.format();
    const maxDateMoment = moment.tz(
      invitation.end,
      convertOutlookTimezoneToIANATimezone(providerLocation.timezone)
    );
    if (maxDateMoment.isBefore(startMoment)) {
      return badRequestForInviteCodeResponse(
        response,
        ErrorConstants.INVITE_CODE_EXPIRED,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
    }
    const maxDate = maxDateMoment.format();
    const end = endOfMonthMoment.isBefore(maxDateMoment)
      ? endOfMonthMoment.format()
      : maxDate;
    const apiResponse: IAvailableBookingSlotsResponse =
      await getAvailableBookingSlotsEndpointHelper(configuration, {
        locationId: providerLocation.identifier,
        serviceType: selectedService.serviceType,
        start,
        end,
      } as IGetAvailableBookingSlotsRequest);

    if (apiResponse.slots) {
      if (
        apiResponse.slots.length === 0 &&
        !endOfMonthMoment.isBefore(maxDateMoment)
      ) {
        return badRequestForInviteCodeResponse(
          response,
          ErrorConstants.INVITE_CODE_ALL_SLOTS_USED,
          InternalResponseCode.INVITE_CODE_ALL_SLOTS_USED
        );
      }
      const bookingAvailabilities = convertToBookingAvailability(
        start,
        end,
        apiResponse.slots
      );
      const availabilityData = getSlotsAndUnavailableDays(
        bookingAvailabilities
      );
      const selectedLocation = buildProviderLocationDetails(
        providerLocation,
        selectedService
      );
      const processInviteResponse: IProcessInviteCodeResponseData = {
        location: selectedLocation,
        availableSlots: availabilityData,
        service: selectedLocation.serviceInfo[0],
        inviteCode,
        minDate: start,
        maxDate,
        serviceNameMyRx: serviceTypeDetails?.serviceNameMyRx ?? '',
        minimumAge: serviceTypeDetails?.minimumAge ?? 0,
        aboutQuestionsDescriptionMyRx:
          serviceTypeDetails?.aboutQuestionsDescriptionMyRx ?? '',
        aboutDependentDescriptionMyRx:
          serviceTypeDetails?.aboutDependentDescriptionMyRx ?? '',
        cancellationPolicyMyRx:
          serviceTypeDetails?.cancellationPolicyMyRx ?? '',
      };
      return SuccessResponse<IProcessInviteCodeResponseData>(
        response,
        SuccessConstants.SUCCESS_OK,
        processInviteResponse
      );
    }

    return KnownFailureResponse(
      response,
      apiResponse.errorCode || HttpStatusCodes.INTERNAL_SERVER_ERROR,
      apiResponse.message
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
