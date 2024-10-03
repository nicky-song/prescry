// Copyright 2022 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IGeolocationAutocompleteResponse } from '../../../models/api-response/geolocation-response';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { ErrorConstants } from '../../../theming/constants';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureAutocompleteGeolocationResponse } from './ensure-api-response/ensure-autocomplete-geolocation-response';
import { withRefreshToken } from './with-refresh-token';
import { buildUrlWithQueryParams } from '../../../utils/api-helpers/build-url-with-queryparams';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { ILocationCoordinates } from '../../../models/location-coordinates';

export const autocompleteGeolocation = async (
  config: IApiConfig,
  query?: string,
  userLocation?: ILocationCoordinates,
  retryPolicy?: IRetryPolicy
): Promise<IGeolocationAutocompleteResponse> => {
  const latitude = userLocation?.latitude
    ? userLocation.latitude.toString()
    : '';
  const longitude = userLocation?.longitude
    ? userLocation.longitude.toString()
    : '';
  const queryParams = {
    query: query || (latitude && longitude ? `${longitude},${latitude}` : ''),
  };
  const url = buildUrlWithQueryParams(
    buildUrl(config, 'geolocationAutocomplete', {}),
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
  if (response.ok && ensureAutocompleteGeolocationResponse(responseJson)) {
    return withRefreshToken<IGeolocationAutocompleteResponse>(
      responseJson,
      response
    );
  }
  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorNotFound,
    APITypes.AUTOCOMPLETE_GEOLOCATION,
    errorResponse.code,
    errorResponse
  );
};
