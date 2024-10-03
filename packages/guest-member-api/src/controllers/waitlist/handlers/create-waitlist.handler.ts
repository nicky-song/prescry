// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IAccount } from '@phx/common/src/models/account';
import { ICreateWaitlistRequestBody } from '@phx/common/src/models/api-request-body/create-waitlist.request-body';
import { ICreateWaitlistData } from '@phx/common/src/models/api-response/create-waitlist.response';
import { IPerson } from '@phx/common/src/models/person';
import {
  CalculateAbsoluteAge,
  UTCDateString,
} from '@phx/common/src/utils/date-time-helper';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { Twilio } from 'twilio';
import { IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { getValidWaitlistForPhoneAndServiceType } from '../../../databases/mongo-database/v1/query-helper/wait-list.query-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { ICreateWaitListRequest } from '../../../models/pharmacy-portal/create-waitlist.request';
import { ICreateWaitlistEndpointResponse } from '../../../models/pharmacy-portal/create-waitlist.response';
import { IWaitList } from '../../../models/wait-list';
import {
  getLoggedInUserProfileForRxGroupType,
  getAllowedPersonsForLoggedInUser,
} from '../../../utils/person/get-dependent-person.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { getServiceDetailsByServiceType } from '../../../utils/external-api/get-service-details-by-service-type';
import {
  KnownFailureResponse,
  SuccessResponse,
  errorResponseWithTwilioErrorHandling,
} from '../../../utils/response-helper';
import { validateMemberDateOfBirth } from '../../../validators/member-date-of-birth.validator';
import { createWaitlistEndpointHelper } from '../../waitlist/helpers/create-waitlist-endpoint.helper';
import { sendWaitlistConfirmationMessage } from '../../waitlist/helpers/send-waitlist-confirmation-message.helper';
import RestException from 'twilio/lib/base/RestException';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function createWaitlistHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration,
  twilioClient: Twilio
) {
  const version = getEndpointVersion(request);
  const {
    serviceType,
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    zipCode,
    maxMilesAway,
    dependentIdentifier,
    myself,
  } = request.body as ICreateWaitlistRequestBody;

  const waitlist: ICreateWaitListRequest = {
    firstName: firstName ? firstName.trim().toUpperCase() : '',
    lastName: lastName ? lastName.trim().toUpperCase() : '',
    phoneNumber: phoneNumber ? phoneNumber.trim() : '',
    dateOfBirth: dateOfBirth || '',
    zipCode,
    serviceType,
    maxMilesAway,
  };
  try {
    const loggedInUserPhoneNumber = getRequiredResponseLocal(
      response,
      'device'
    ).data;
    waitlist.addedBy = loggedInUserPhoneNumber;
    const personInfo: IPerson | undefined =
      getLoggedInUserProfileForRxGroupType(response, 'CASH');
    const account: IAccount = getRequiredResponseLocal(response, 'account');
    const addedByFirstName = personInfo
      ? personInfo.firstName
      : account.firstName;
    const addedByLastName = personInfo ? personInfo.lastName : account.lastName;
    if (myself) {
      if (personInfo) {
        waitlist.firstName = personInfo.firstName;
        waitlist.lastName = personInfo.lastName;
        waitlist.dateOfBirth = personInfo.dateOfBirth;
      } else {
        waitlist.firstName = account.firstName || '';
        waitlist.lastName = account.lastName || '';
        waitlist.dateOfBirth = account.dateOfBirth
          ? UTCDateString(account.dateOfBirth)
          : '';
      }
      waitlist.phoneNumber = loggedInUserPhoneNumber;
    } else if (dependentIdentifier) {
      const allowedPersons = getAllowedPersonsForLoggedInUser(response);
      const dependentPerson = allowedPersons
        ? allowedPersons.find(
            (depPerson) => depPerson.identifier === dependentIdentifier
          )
        : undefined;
      if (!dependentPerson) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.WAITLIST_INVALID_DEPENDENT
        );
      }
      waitlist.firstName = dependentPerson.firstName;
      waitlist.lastName = dependentPerson.lastName;
      waitlist.dateOfBirth = dependentPerson.dateOfBirth;
      waitlist.phoneNumber = loggedInUserPhoneNumber;
    } else {
      if (
        waitlist.firstName.trim().length > 0 &&
        waitlist.lastName.trim().length > 0 &&
        waitlist.dateOfBirth &&
        validateMemberDateOfBirth(waitlist.dateOfBirth)
      ) {
        waitlist.dateOfBirth = UTCDateString(waitlist.dateOfBirth);
        if (waitlist.phoneNumber.length === 0) {
          waitlist.phoneNumber = loggedInUserPhoneNumber;
        }
      } else {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.WAITLIST_MISSING_INFORMATION,
          undefined,
          InternalResponseCode.WAITLIST_MISSING_INFORMATION
        );
      }
    }
    const serviceResponse = await getServiceDetailsByServiceType(
      configuration,
      waitlist.serviceType
    );
    const service = serviceResponse.service;
    if (!service) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.INVALID_SERVICE_TYPE
      );
    }
    const existingWaitList: IWaitList[] | null =
      await getValidWaitlistForPhoneAndServiceType(
        database,
        waitlist.phoneNumber,
        serviceType
      );
    const alreadyExisting: boolean =
      existingWaitList &&
      existingWaitList.length > 0 &&
      existingWaitList.some(
        (item) =>
          item.firstName.toUpperCase() === waitlist.firstName &&
          item.lastName.toUpperCase() === waitlist.lastName &&
          item.dateOfBirth === waitlist.dateOfBirth
      );
    if (alreadyExisting) {
      const parameterMap = new Map<string, string>([
        ['serviceName', service.serviceNameMyRx],
      ]);
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        StringFormatter.format(
          ErrorConstants.WAITLIST_ALREADY_ADDED,
          parameterMap
        ),
        undefined,
        InternalResponseCode.WAITLIST_ALREADY_ADDED
      );
    }

    const age = CalculateAbsoluteAge(new Date(), waitlist.dateOfBirth);
    const minAge = service.minimumAge || ApiConstants.APPOINTMENT_MIN_AGE_LIMIT;
    if (age < minAge) {
      const parameterMap = new Map<string, string>([
        ['age', minAge.toString()],
        ['serviceName', service.serviceNameMyRx],
      ]);

      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        StringFormatter.format(
          ErrorConstants.WAITLIST_AGE_REQUIREMENT_NOT_MET,
          parameterMap
        ),
        undefined,
        InternalResponseCode.WAITLIST_MIN_AGE_NOT_MET
      );
    }
    const apiResponse: ICreateWaitlistEndpointResponse =
      await createWaitlistEndpointHelper(configuration, waitlist);
    if (apiResponse.waitlist) {
      await sendWaitlistConfirmationMessage(
        configuration,
        twilioClient,
        waitlist,
        service.serviceNameMyRx,
        response,
        version,
        addedByFirstName,
        addedByLastName
      );
      return SuccessResponse<ICreateWaitlistData>(
        response,
        SuccessConstants.SUCCESS_OK,
        { ...apiResponse.waitlist, serviceName: service.serviceNameMyRx }
      );
    }
    return KnownFailureResponse(
      response,
      apiResponse.errorCode || HttpStatusCodes.INTERNAL_SERVER_ERROR,
      apiResponse.message
    );
  } catch (error) {
    return errorResponseWithTwilioErrorHandling(
      response,
      waitlist.phoneNumber,
      error as RestException
    );
  }
}
