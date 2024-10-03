// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { ITestResultResponse } from '../../../models/api-response/test-result-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureTestResultResponse } from './ensure-api-response/ensure-test-result-response';
import { withRefreshToken } from './with-refresh-token';

export const getTestResult = async (
  config: IApiConfig,
  authToken?: string,
  retryPolicy?: IRetryPolicy,
  deviceToken?: string,
  orderNumber?: string
): Promise<ITestResultResponse> => {
  const url = buildUrl(config, 'testResult', {});

  const response: Response = await call(
    orderNumber ? `${url}?ordernumber=${orderNumber}` : url,
    undefined,
    'GET',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureTestResultResponse(responseJson)) {
    return withRefreshToken<ITestResultResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingTestResults,
    APITypes.TEST_RESULTS,
    errorResponse.code
  );
};
