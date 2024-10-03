// Copyright 2021 Prescryptive Health, Inc.

import { IVerifyIdentityRequestBody } from '../../../models/api-request-body/verify-identity.request-body';
import { IFailureResponse } from '../../../models/api-response';
import { IIdentityVerificationResponse } from '../../../models/api-response/identity-verification.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureIdentityVerificationResponse } from './ensure-api-response/ensure-identity-verification-response';
import { withRefreshToken } from './with-refresh-token';

export const verifyIdentity = async (
  config: IApiConfig,
  verifyIdentityRequestBody: IVerifyIdentityRequestBody,
  deviceToken?: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IIdentityVerificationResponse> => {
  const url = buildUrl(config, 'verifyIdentity', {});
  const response: Response = await call(
    url,
    verifyIdentityRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureIdentityVerificationResponse(responseJson)) {
    return withRefreshToken<IIdentityVerificationResponse>(
      responseJson,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForVerifyingIdentity,
    APITypes.VERIFY_IDENTITY,
    errorResponse.code,
    errorResponse
  );
};
