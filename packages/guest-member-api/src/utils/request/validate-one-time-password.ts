// Copyright 2022 Prescryptive Health, Inc.

import { Twilio } from 'twilio';
import { OneTimePasswordVerificationStatus } from '../../constants/one-time-password-verification-status';
import { BadRequestError } from '../../errors/request-errors/bad.request-error';
import { verifyOneTimePassword } from '../twilio-helper';

export const validateOneTimePassword = async (
  twilioClient: Twilio,
  twilioVerificationServiceId: string,
  phoneNumber: string,
  oneTimePassword: string
): Promise<void> => {
  const twilioResponse = await verifyOneTimePassword(
    twilioClient,
    twilioVerificationServiceId,
    phoneNumber,
    oneTimePassword
  );

  if (twilioResponse.status !== 'approved') {
    throw new BadRequestError(OneTimePasswordVerificationStatus.INVALID_CODE);
  }
};
