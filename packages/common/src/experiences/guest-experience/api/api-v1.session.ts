// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureSessionResponse } from './ensure-api-response/ensure-session-response';
import { ISessionResponse } from '../../../models/api-response/session-response';

export const getSession = async (
  config: IApiConfig,
  retryPolicy: IRetryPolicy,
  authToken?: string,
  deviceToken?: string
): Promise<ISessionResponse> => {
  const url = buildUrl(config, 'session', {});

  const response: Response = await call(
    url,
    {},
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureSessionResponse(responseJson)) {
    return responseJson;
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorInternalServer(),
    APITypes.SESSION,
    errorResponse.code,
    errorResponse
  );
};
