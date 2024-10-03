// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IGeolocationResponse } from '../../../../models/api-response/geolocation-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureGeolocationResponse = (responseJson: unknown) => {
  const response = responseJson as IGeolocationResponse;
  const isValid = response.data;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
