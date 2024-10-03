// Copyright 2021 Prescryptive Health, Inc.

import { IUpdateRecoveryEmailRequestBody } from '../../../models/api-request-body/update-recovery-email.request-body';
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

export const updateRecoveryEmail = async (
  config: IApiConfig,
  updateRecoveryEmailRequestBody: IUpdateRecoveryEmailRequestBody,
  deviceToken?: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IApiResponse> => {
  const url = buildUrl(config, 'updateRecoveryEmail', {});

  const response: Response = await call(
    url,
    updateRecoveryEmailRequestBody,
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
    ErrorConstants.errorForUpdateRecoveryEmail,
    APITypes.UPDATE_RECOVERY_EMAIL,
    errorResponse.code,
    errorResponse
  );
};
