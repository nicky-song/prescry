// Copyright 2021 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IGeolocationResponse } from '../../../models/api-response/geolocation-response';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { ErrorConstants } from '../../../theming/constants';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureGeolocationResponse } from './ensure-api-response/ensure-geolocation-response';
import { withRefreshToken } from './with-refresh-token';
import { buildUrlWithQueryParams } from '../../../utils/api-helpers/build-url-with-queryparams';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { ILocationCoordinates } from '../../../models/location-coordinates';

export const getNearestGeolocationAndStorePharmacies = async (
  config: IApiConfig,
  userLocation?: ILocationCoordinates,
  retryPolicy?: IRetryPolicy
): Promise<IGeolocationResponse> => {
  const queryParams = {
    zipcode: userLocation?.zipCode || '',
    latitude: userLocation?.latitude ? userLocation.latitude.toString() : '',
    longitude: userLocation?.longitude ? userLocation.longitude.toString() : '',
  };
  const url = buildUrlWithQueryParams(
    buildUrl(config, 'geolocationPharmacies', {}),
    queryParams
  );
  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(config),
    retryPolicy
  );
  const responseJson = await response.json();
  if (response.ok && ensureGeolocationResponse(responseJson)) {
    return withRefreshToken<IGeolocationResponse>(responseJson, response);
  }
  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorNotFound,
    APITypes.GEOLOCATION,
    errorResponse.code,
    errorResponse
  );
};
