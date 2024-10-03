// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IPastProcedureResponse } from '../../../models/api-response/past-procedure-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensurePastProceduresListResponse } from './ensure-api-response/ensure-past-procedures-list-response';
import { withRefreshToken } from './with-refresh-token';

export const getPastProceduresList = async (
  config: IApiConfig,
  authToken?: string,
  retryPolicy?: IRetryPolicy,
  deviceToken?: string
): Promise<IPastProcedureResponse> => {
  const url = buildUrl(config, 'pastProcedures', {});
  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensurePastProceduresListResponse(responseJson)) {
    return withRefreshToken<IPastProcedureResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingPastProceduresList,
    APITypes.TEST_RESULTS_LIST,
    errorResponse.code,
    errorResponse
  );
};
