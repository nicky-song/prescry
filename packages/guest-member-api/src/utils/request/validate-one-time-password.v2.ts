// Copyright 2022 Prescryptive Health, Inc.

import { generateSHA512Hash } from '@phx/common/src/utils/crypto.helper';
import { IConfiguration } from '../../configuration';
import { HttpStatusCodes } from '../../constants/error-codes';
import { OneTimePasswordVerificationStatus } from '../../constants/one-time-password-verification-status';
import { BadRequestError } from '../../errors/request-errors/bad.request-error';
import { EndpointError } from '../../errors/endpoint.error';
import { PATIENT_ACCOUNT_SOURCE_MYRX } from '../../models/platform/patient-account/patient-account';
import {
  confirmContact,
  IConfirmContactProps,
} from '../external-api/patient-account/confirm-contact';

export const validateOneTimePasswordV2 = async (
  configuration: IConfiguration,
  contactValue: string,
  oneTimePassword: string
): Promise<void> => {
  const confirmContactProps: IConfirmContactProps = {
    contactValue,
    contactHash: generateSHA512Hash(contactValue),
    source: PATIENT_ACCOUNT_SOURCE_MYRX,
    confirmationCode: oneTimePassword,
  };

  try {
    const response = await confirmContact(configuration, confirmContactProps);

    if (!response.isVerified) {
      throw new BadRequestError(OneTimePasswordVerificationStatus.INVALID_CODE);
    }
  } catch (error) {
    if (
      error instanceof EndpointError &&
      error.errorCode === HttpStatusCodes.BAD_REQUEST
    ) {
      throw new BadRequestError(OneTimePasswordVerificationStatus.INVALID_CODE);
    }

    throw error;
  }
};
