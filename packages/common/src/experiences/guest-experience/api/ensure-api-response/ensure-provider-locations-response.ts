// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IProviderLocationResponse } from '../../../../models/api-response/provider-location-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureProviderLocationsResponse = (responseJson: unknown) => {
  const response = responseJson as IProviderLocationResponse;

  if (!response.data) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
