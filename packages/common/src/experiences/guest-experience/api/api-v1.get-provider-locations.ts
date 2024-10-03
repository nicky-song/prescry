// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IProviderLocationResponse } from '../../../models/api-response/provider-location-response';
import { ErrorConstants } from '../../../theming/constants';
import { buildUrlWithQueryParams } from '../../../utils/api-helpers/build-url-with-queryparams';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureProviderLocationsResponse } from './ensure-api-response/ensure-provider-locations-response';
import { withRefreshToken } from './with-refresh-token';

export const getProviderLocations = async (
  config: IApiConfig,
  zipCode?: string,
  distance?: number,
  authToken?: string,
  retryPolicy?: IRetryPolicy,
  deviceToken?: string,
  serviceType?: string
): Promise<IProviderLocationResponse> => {
  const queryParams = {
    ...(serviceType && { servicetype: serviceType || '' }),
    ...(zipCode && { zipcode: zipCode || '' }),
    ...(distance && { distance: distance.toString() || '' }),
  };
  const url = buildUrlWithQueryParams(
    buildUrl(config, 'providerLocations', {}),
    queryParams
  );

  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureProviderLocationsResponse(responseJson)) {
    return withRefreshToken<IProviderLocationResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingProviderLocations,
    APITypes.PROVIDER_LOCATIONS,
    errorResponse.code,
    errorResponse
  );
};
