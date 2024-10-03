// Copyright 2022 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IAccumulatorResponse } from '../../../models/api-response/accumulators.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  IApiConfig,
  buildUrl,
  buildCommonHeaders,
  call,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { handleHttpErrors, APITypes } from './api-v1-helper';
import { ensureGetAccumulatorsResponse } from './ensure-api-response/ensure-accumulators.response';
import { withRefreshToken } from './with-refresh-token';

export const getAccumulators = async (
  apiConfig: IApiConfig,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IAccumulatorResponse> => {
  const url = buildUrl(apiConfig, 'accumulators', {});
  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(apiConfig, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureGetAccumulatorsResponse(responseJson)) {
    return withRefreshToken<IAccumulatorResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingAccumulators,
    APITypes.GET_ACCUMULATORS,
    errorResponse.code,
    errorResponse
  );
};
