// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  LoginMessages as responseMessage,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { addPhoneRegistrationKeyInRedis } from '../../../databases/redis/redis-query-helper';
import {
  trackMissingData,
  trackNewPhoneNumberRegistrationEvent,
  trackRegistrationFailureEvent,
} from '../../../utils/custom-event-helper';
import { SuccessResponseWithoutHeaders } from '../../../utils/response-helper';
import { publishAccountUpdateMessageAndAddToRedis } from '../../../utils/account/account.helper';
import { IMembershipVerificationResponse } from '../../members/helpers/membership-verification.helper';

export function invalidMemberDetailsResponse(
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  primaryMemberRxId: string
): IMembershipVerificationResponse {
  trackRegistrationFailureEvent(
    'InvalidMemberDetails',
    firstName,
    lastName,
    primaryMemberRxId,
    dateOfBirth
  );
  return {
    isValidMembership: false,
    responseCode: HttpStatusCodes.NOT_FOUND,
    responseMessage: responseMessage.INVALID_USER_DETAILS,
  };
}

export function invalidMemberResponse(
  primaryMemberRxId: string
): IMembershipVerificationResponse {
  trackMissingData('identifier', primaryMemberRxId, 'Person');

  return {
    isValidMembership: false,
    responseCode: HttpStatusCodes.SERVER_DATA_ERROR,
    responseMessage: ErrorConstants.INTERNAL_SERVER_ERROR,
  };
}

export function invalidMemberRxIdResponse(
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  primaryMemberRxId: string
): IMembershipVerificationResponse {
  trackRegistrationFailureEvent(
    'InvalidMemberRxId',
    firstName,
    lastName,
    primaryMemberRxId,
    dateOfBirth
  );
  return {
    isValidMembership: false,
    responseCode: HttpStatusCodes.NOT_FOUND,
    responseMessage: responseMessage.INVALID_MEMBER_RXID,
  };
}

export async function loginSuccessResponse(
  response: Response,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  redisPhoneNumberRegistrationKeyExpiryTime: number,
  modelFound: IPerson,
  addMembership: boolean,
  recoveryEmail?: string
): Promise<Response> {
  await addPhoneRegistrationKeyInRedis(
    phoneNumber,
    modelFound,
    redisPhoneNumberRegistrationKeyExpiryTime
  );

  trackNewPhoneNumberRegistrationEvent(phoneNumber, modelFound.identifier);

  if (addMembership) {
    return SuccessResponseWithoutHeaders(
      response,
      responseMessage.ADD_MEMBERSHIP_SUCCESS
    );
  }
  await publishAccountUpdateMessageAndAddToRedis(
    {
      dateOfBirth,
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      phoneNumber,
      recoveryEmail,
      recentlyUpdated: true,
    },
    redisPhoneNumberRegistrationKeyExpiryTime
  );
  return SuccessResponseWithoutHeaders(
    response,
    responseMessage.AUTHENTICATION_SUCCESSFUL,
    InternalResponseCode.REQUIRE_USER_SET_PIN
  );
}
