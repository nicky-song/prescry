// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IPharmacySearchResponse } from '../../../../models/api-response/pharmacy-search.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureSearchPharmacyResponse = (responseJson: unknown) => {
  const response = responseJson as IPharmacySearchResponse;
  const isValid = response.data;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
