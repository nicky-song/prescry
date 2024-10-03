// Copyright 2021 Prescryptive Health, Inc.

import { ISendVerificationCodeRequestBody } from '../../../models/api-request-body/send-verification-code.request-body';
import { IApiResponse, IFailureResponse } from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import {
  APITypes,
  handleHttpErrors,
  handleTwilioHttpErrors,
} from './api-v1-helper';
import { ensureSendVerificationCodeResponse } from './ensure-api-response/ensure-send-verification-code-response';
import { withRefreshToken } from './with-refresh-token';

export const sendVerificationCode = async (
  config: IApiConfig,
  sendVerificationCodeRequestBody: ISendVerificationCodeRequestBody,
  deviceToken?: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IApiResponse> => {
  const url = buildUrl(config, 'sendVerificationCode', {});

  const response: Response = await call(
    url,
    sendVerificationCodeRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureSendVerificationCodeResponse(responseJson)) {
    return withRefreshToken<IApiResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;

  const error = handleTwilioHttpErrors(
    response.status,
    APITypes.SEND_VERIFICATION_CODE,
    errorResponse.code
  );
  if (error) {
    throw error;
  }

  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForSendVerificationCode,
    APITypes.SEND_VERIFICATION_CODE,
    errorResponse.code,
    errorResponse
  );
};
