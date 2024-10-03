// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IIdentityVerificationResponse } from '../../../../models/api-response/identity-verification.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureIdentityVerificationResponse = (
  responseJson: unknown
): IIdentityVerificationResponse => {
  const response = responseJson as IIdentityVerificationResponse;
  const isValid =
    response.data &&
    response.data.maskedPhoneNumber &&
    response.data.maskedEmailAddress;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
