// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import {
  HttpStatusCodes,
  InternalErrorCode,
} from '@phx/common/src/errors/error-codes';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IConfiguration } from '../../../configuration';
import {
  addIdentityVerificationAttemptsKeyInRedis,
  getIdentityVerificationAttemptsDataFromRedis,
} from '../../../databases/redis/redis-query-helper';
import { trackPinResetLockedEvent } from '../../../utils/custom-event-helper';
import { IIdentityVerificationKeyValues } from '../../../utils/redis/redis.helper';
import { KnownFailureResponse } from '../../../utils/response-helper';

export const resetPinFailureResponse = async (
  response: Response,
  phoneNumber: string,
  configuration: IConfiguration
): Promise<Response> => {
  const identityVerificationDataInRedis:
    | IIdentityVerificationKeyValues
    | undefined = await getIdentityVerificationAttemptsDataFromRedis(
    phoneNumber
  );
  const identityVerificationAttempt =
    ((identityVerificationDataInRedis &&
      identityVerificationDataInRedis.identityVerificationAttempt) ||
      0) + 1;

  await addIdentityVerificationAttemptsKeyInRedis(
    phoneNumber,
    configuration.redisIdentityVerificationKeyExpiryTime,
    identityVerificationAttempt
  );

  const reachedMaxVerificationAttempts =
    identityVerificationAttempt ===
    configuration.maxIdentityVerificationAttempts;

  if (reachedMaxVerificationAttempts) {
    trackPinResetLockedEvent(phoneNumber);
  }
  const parameterMap = new Map<string, string>([
    [
      'attempts',
      (
        configuration.maxIdentityVerificationAttempts -
        identityVerificationAttempt
      ).toString(),
    ],
  ]);

  return KnownFailureResponse(
    response,
    HttpStatusCodes.BAD_REQUEST,
    reachedMaxVerificationAttempts
      ? ErrorConstants.PIN_RESET_LOCKED
      : StringFormatter.format(ErrorConstants.PIN_RESET_FAILED, parameterMap),
    undefined,
    reachedMaxVerificationAttempts
      ? InternalErrorCode.SHOW_ACCOUNT_LOCKED
      : undefined,
    {
      reachedMaxVerificationAttempts,
    }
  );
};
