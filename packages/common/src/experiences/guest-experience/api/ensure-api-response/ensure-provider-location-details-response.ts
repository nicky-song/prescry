// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IProviderLocationDetailsResponse } from '../../../../models/api-response/provider-location-details-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureProviderLocationDetailsResponse = (
  responseJson: unknown
) => {
  const response = responseJson as IProviderLocationDetailsResponse;
  const isValid = response.data && response.data.location;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
