// Copyright 2021 Prescryptive Health, Inc.

import { IAddRecoveryEmailRequestBody } from '../../../models/api-request-body/add-recovery-email.request-body';
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
import { ensureAddRecoveryEmailResponse } from './ensure-api-response/ensure-add-recovery-email-response';
import { withRefreshToken } from './with-refresh-token';

export const addRecoveryEmail = async (
  config: IApiConfig,
  addRecoveryEmailRequestBody: IAddRecoveryEmailRequestBody,
  deviceToken?: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IApiResponse> => {
  const url = buildUrl(config, 'addRecoveryEmail', {});

  const response: Response = await call(
    url,
    addRecoveryEmailRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureAddRecoveryEmailResponse(responseJson)) {
    return withRefreshToken<IApiResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForAddRecoveryEmail,
    APITypes.ADD_RECOVERY_EMAIL,
    errorResponse.code,
    errorResponse
  );
};
