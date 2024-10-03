// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse, IApiResponse } from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { withRefreshToken } from './with-refresh-token';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { buildUrlWithQueryParams } from '../../../utils/api-helpers/build-url-with-queryparams';

export const acceptConsent = async (
  config: IApiConfig,
  retryPolicy?: IRetryPolicy,
  authToken?: string,
  deviceToken?: string,
  serviceType?: string
): Promise<IApiResponse> => {
  const queryParams = {
    ...(serviceType && { servicetype: serviceType || '' }),
  };
  const url = buildUrlWithQueryParams(
    buildUrl(config, 'acceptConsent', {}),
    queryParams
  );

  const response: Response = await call(
    url,
    {},
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok) {
    return withRefreshToken(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForConsent,
    APITypes.ACCEPT_CONSENT,
    errorResponse.code,
    errorResponse
  );
};
