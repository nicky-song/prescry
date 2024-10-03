// Copyright 2022 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IClaimAlertResponse } from '../../../../models/api-response/claim-alert.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureGetClaimAlertResponse = (responseJson: unknown) => {
  const response = responseJson as IClaimAlertResponse;
  const isValid = response.data;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
