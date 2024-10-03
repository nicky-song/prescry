// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ICreateAccountResponse } from '../../../../models/api-response/create-account.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureCreateAccountResponse = (
  responseJson: unknown
): ICreateAccountResponse => {
  const response = responseJson as ICreateAccountResponse;
  const isValid = response.data && response.data.deviceToken;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
