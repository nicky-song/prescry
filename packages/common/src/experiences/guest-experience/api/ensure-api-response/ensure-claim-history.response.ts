// Copyright 2022 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IClaimHistoryResponse } from '../../../../models/api-response/claim-history.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureGetClaimHistoryResponse = (responseJson: unknown) => {
  const response = responseJson as IClaimHistoryResponse;
  const isValid = response.data;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
