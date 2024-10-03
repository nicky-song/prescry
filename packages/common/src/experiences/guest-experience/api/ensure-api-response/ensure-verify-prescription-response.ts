// Copyright 2022 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IPrescriptionVerificationResponse } from '../../../../models/api-response/prescription-verification-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureVerifyPrescriptionResponse = (responseJson: unknown) => {
  const response = responseJson as IPrescriptionVerificationResponse;
  const isValid = response.data && response.data.phoneNumber;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
