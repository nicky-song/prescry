// Copyright 2022 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IClaimAlertResponse } from '../../../models/api-response/claim-alert.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  IApiConfig,
  buildCommonHeaders,
  call,
  buildUrl,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { handleHttpErrors, APITypes } from './api-v1-helper';
import { ensureGetClaimAlertResponse } from './ensure-api-response/ensure-claim-alert.response';
import { withRefreshToken } from './with-refresh-token';

export const getClaimAlert = async (
  apiConfig: IApiConfig,
  identifier: string,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IClaimAlertResponse> => {
  const url = buildUrl(apiConfig, 'claimAlert', {
    ':identifier': identifier,
  });

  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(apiConfig, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();

  if (response.ok && ensureGetClaimAlertResponse(responseJson)) {
    return withRefreshToken<IClaimAlertResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingClaimAlert,
    APITypes.GET_CLAIM_ALERT,
    errorResponse.code,
    errorResponse
  );
};
