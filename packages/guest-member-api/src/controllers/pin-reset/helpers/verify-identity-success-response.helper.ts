// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { addIdentityVerificationAttemptsKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { SuccessResponse } from '../../../utils/response-helper';
import { IConfiguration } from '../../../configuration';
import { maskEmail, maskPhoneNumber } from './mask-values.helper';
import { SuccessConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';

export const verifyIdentitySuccessResponse = async (
  response: Response,
  phoneNumber: string,
  emailAddress: string,
  configuration: IConfiguration
): Promise<Response> => {
  await addIdentityVerificationAttemptsKeyInRedis(
    phoneNumber,
    configuration.redisIdentityVerificationKeyExpiryTime
  );

  const maskedEmailAddress = maskEmail(emailAddress);
  const maskedPhoneNumber = maskPhoneNumber(phoneNumber);

  return SuccessResponse(response, SuccessConstants.VERIFY_IDENTITY_SUCCESS, {
    maskedEmailAddress,
    maskedPhoneNumber,
  });
};
