// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IResetPinResponse } from '../../../../models/api-response/reset-pin.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureResetPinResponse = (responseJson: unknown) => {
  const response = responseJson as IResetPinResponse;
  const isValid = response.data && response.data.deviceToken;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
