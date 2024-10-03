// Copyright 2022 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IGeolocationAutocompleteResponse } from '../../../../models/api-response/geolocation-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureAutocompleteGeolocationResponse = (
  responseJson: unknown
) => {
  const response = responseJson as IGeolocationAutocompleteResponse;
  const isValid = response.data;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
