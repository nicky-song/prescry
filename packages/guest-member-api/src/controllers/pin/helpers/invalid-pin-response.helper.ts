// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPinVerificationKeyValues } from '../../../utils/redis/redis.helper';
import {
  getPinVerificationDataFromRedis,
  addPinVerificationKeyInRedis,
} from '../../../databases/redis/redis-query-helper';
import { KnownFailureResponse } from '../../../utils/response-helper';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import { ErrorConstants } from '../../../constants/response-messages';
import {
  trackPinVerificationFailedEvent,
  trackSessionLockedEvent,
} from '../../../utils/custom-event-helper';
import { IConfiguration } from '../../../configuration';

export const invalidPinResponse = async (
  response: Response,
  phoneNumber: string,
  deviceIdentifier: string,
  configuration: IConfiguration,
  isUpdatePin: boolean
): Promise<Response> => {
  const pinVerificationDataInRedis: IPinVerificationKeyValues | undefined =
    await getPinVerificationDataFromRedis(phoneNumber, deviceIdentifier);

  const pinVerificationAttempt =
    ((pinVerificationDataInRedis &&
      pinVerificationDataInRedis.pinVerificationAttempt) ||
      0) + 1;

  await addPinVerificationKeyInRedis(
    phoneNumber,
    configuration.redisPinVerificationKeyExpiryTime,
    deviceIdentifier,
    pinVerificationAttempt
  );
  if (isUpdatePin) {
    return KnownFailureResponse(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_PIN,
      undefined,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    );
  }

  trackPinVerificationFailedEvent(phoneNumber, pinVerificationAttempt);
  if (pinVerificationAttempt === configuration.maxPinVerificationAttempts) {
    trackSessionLockedEvent(phoneNumber);
  }
  return KnownFailureResponse(
    response,
    HttpStatusCodes.BAD_REQUEST,
    ErrorConstants.INVALID_PIN,
    undefined,
    undefined,
    { pinVerificationAttempt }
  );
};
