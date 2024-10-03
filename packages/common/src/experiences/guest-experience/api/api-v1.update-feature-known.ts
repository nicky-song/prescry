// Copyright 2022 Prescryptive Health, Inc.

import { IApiResponse, IFailureResponse } from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureUpdateRecoveryEmailResponse } from './ensure-api-response/ensure-update-recovery-email-response';
import { withRefreshToken } from './with-refresh-token';

export const updateFeatureKnown = async (
  config: IApiConfig,
  deviceToken?: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IApiResponse> => {
  const url = buildUrl(config, 'updateFeatureKnown', {});

  const response: Response = await call(
    url,
    {},
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureUpdateRecoveryEmailResponse(responseJson)) {
    return withRefreshToken<IApiResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForUpdateFeatureKnown,
    APITypes.UPDATE_FEATURE_KNOWN,
    errorResponse.code,
    errorResponse
  );
};
