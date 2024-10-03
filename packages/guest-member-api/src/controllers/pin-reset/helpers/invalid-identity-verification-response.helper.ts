// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { IConfiguration } from '../../../configuration';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { addIdentityVerificationAttemptsKeyInRedis } from '../../../databases/redis/redis-query-helper';
import {
  trackIdentityVerificationFailedEvent,
  trackIdentityVerificationLockedEvent,
} from '../../../utils/custom-event-helper';
import { IIdentityVerificationKeyValues } from '../../../utils/redis/redis.helper';
import { KnownFailureResponse } from '../../../utils/response-helper';

export const invalidIdentityVerificationResponse = async (
  response: Response,
  phoneNumber: string,
  configuration: IConfiguration,
  identityVerificationDataInRedis?: IIdentityVerificationKeyValues
): Promise<Response> => {
  const identityVerificationAttempt =
    ((identityVerificationDataInRedis &&
      identityVerificationDataInRedis.identityVerificationAttempt) ||
      0) + 1;

  await addIdentityVerificationAttemptsKeyInRedis(
    phoneNumber,
    configuration.redisIdentityVerificationKeyExpiryTime,
    identityVerificationAttempt
  );

  trackIdentityVerificationFailedEvent(
    phoneNumber,
    identityVerificationAttempt
  );

  const reachedMaxVerificationAttempts =
    identityVerificationAttempt ===
    configuration.maxIdentityVerificationAttempts;

  if (reachedMaxVerificationAttempts) {
    trackIdentityVerificationLockedEvent(phoneNumber);
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
      ? ErrorConstants.IDENTITY_VERIFICATION_LOCKED
      : StringFormatter.format(
          ErrorConstants.IDENTITY_VERIFICATION_FAILED,
          parameterMap
        ),
    undefined,
    undefined,
    {
      reachedMaxVerificationAttempts,
    }
  );
};
