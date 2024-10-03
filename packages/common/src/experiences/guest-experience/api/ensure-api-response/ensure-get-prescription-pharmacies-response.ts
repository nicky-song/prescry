// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IPharmacyPriceSearchResponse } from '../../../../models/api-response/pharmacy-price-search.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureGetPrescriptionPharmaciesResponse = (
  responseJson: unknown
) => {
  const response = responseJson as IPharmacyPriceSearchResponse;
  const isValid = response.data;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
