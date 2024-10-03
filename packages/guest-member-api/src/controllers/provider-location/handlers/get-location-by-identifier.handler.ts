// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { ErrorConstants } from '../../../constants/response-messages';
import { getRequiredRequestQuery } from '../../../utils/request/get-request-query';
import { generateSuccessResponseForLocation } from '../helpers/generate-success-response-location.helper';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';

import { trackProviderLocationDetailsFailureEvent } from '../../../utils/custom-event-helper';
import { ApiConstants } from '../../../constants/api-constants';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import { IConfiguration } from '../../../configuration';
import { getProviderLocationByIdAndServiceType } from '../helpers/get-provider-location-by-id-and-service-type.helper';
import { IProviderLocationResponse } from '../../../models/pharmacy-portal/get-provider-location.response';

export async function getLocationByIdentifierHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const identifier = request.params.identifier;
    const serviceType = getRequiredRequestQuery(request, 'servicetype');
    const features = getRequiredResponseLocal(response, 'features');
    const account = getRequiredResponseLocal(response, 'account');

    const personList = getResponseLocal(response, 'personList');
    const isTestMember =
      features.usepharmacy ||
      features.usetestpharmacy ||
      personList?.find((p) => p.isTestMembership);

    const providerLocation: IProviderLocationResponse =
      await getProviderLocationByIdAndServiceType(
        configuration,
        identifier,
        serviceType
      );

    if (
      !providerLocation.location ||
      !providerLocation.location.enabled ||
      (providerLocation.location.isTest && !isTestMember)
    ) {
      trackProviderLocationDetailsFailureEvent(
        serviceType,
        StringFormatter.format(
          ErrorConstants.LOCATION_NOT_FOUND,
          new Map<string, string>([['locationId', identifier]])
        )
      );
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.INVALID_SERVICE_LOCATION
      );
    }

    if (
      !providerLocation.location.serviceList ||
      !providerLocation.service ||
      (providerLocation.location.serviceList[0].status &&
        providerLocation.location.serviceList[0].status !== 'everyone') ||
      (providerLocation.location.serviceList[0].isTestService && !isTestMember)
    ) {
      trackProviderLocationDetailsFailureEvent(
        serviceType,
        StringFormatter.format(
          ErrorConstants.SERVICE_TYPE_NOT_FOUND,
          new Map<string, string>([
            ['locationId', identifier],
            ['serviceType', serviceType],
          ])
        )
      );
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.INVALID_SERVICE_LOCATION
      );
    }

    const minAgeScheduler =
      providerLocation.service.schedulerMinimumAge ||
      ApiConstants.SCHEDULER_MIN_AGE_LIMIT;
    if (
      !account.dateOfBirth ||
      CalculateAbsoluteAge(new Date(), account.dateOfBirth) < minAgeScheduler
    ) {
      const ageError = StringFormatter.format(
        ErrorConstants.DEEP_LINK_SCHEDULER_AGE_REQUIREMENT_NOT_MET,
        new Map<string, string>([
          ['ageRequirement', minAgeScheduler.toString()],
          ['serviceName', providerLocation.service.serviceName],
          ['supportEmail', configuration.supportEmail],
        ])
      );
      trackProviderLocationDetailsFailureEvent(
        serviceType,
        ageError,
        account.dateOfBirth
      );
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ageError,
        undefined,
        InternalResponseCode.SCHEDULER_AGE_REQUIREMENT_NOT_MET
      );
    }

    return generateSuccessResponseForLocation(
      response,
      providerLocation.location,
      providerLocation.service
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
