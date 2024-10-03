// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IProviderLocationDetailsResponse } from '../../../models/api-response/provider-location-details-response';
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
import { ensureProviderLocationDetailsResponse } from './ensure-api-response/ensure-provider-location-details-response';
import { withRefreshToken } from './with-refresh-token';

export const getProviderLocationDetails = async (
  config: IApiConfig,
  serviceType: string,
  identifier: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy,
  deviceToken?: string
): Promise<IProviderLocationDetailsResponse> => {
  const queryParams = {
    ...{ servicetype: serviceType },
  };
  const url = buildUrlWithQueryParams(
    buildUrl(config, 'providerLocationDetails', { ':identifier': identifier }),
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
  if (response.ok && ensureProviderLocationDetailsResponse(responseJson)) {
    return withRefreshToken<IProviderLocationDetailsResponse>(
      responseJson,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingProviderLocationDetails,
    APITypes.PROVIDER_LOCATION_DETAILS,
    errorResponse.code,
    errorResponse
  );
};
