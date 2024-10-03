// Copyright 2021 Prescryptive Health, Inc.

import { ICreateWaitlistRequestBody } from '../../../models/api-request-body/create-waitlist.request-body';
import { IFailureResponse } from '../../../models/api-response';
import { ICreateWaitlistResponse } from '../../../models/api-response/create-waitlist.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureJoinWaitlistResponse } from './ensure-api-response/ensure-join-waitlist-response';
import { withRefreshToken } from './with-refresh-token';

export const joinWaitlist = async (
  config: IApiConfig,
  joinWaitlistRequestBody: ICreateWaitlistRequestBody,
  deviceToken?: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<ICreateWaitlistResponse> => {
  const url = buildUrl(config, 'joinWaitlist', {});

  const response: Response = await call(
    url,
    joinWaitlistRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureJoinWaitlistResponse(responseJson)) {
    return withRefreshToken<ICreateWaitlistResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForJoinWaitlist,
    APITypes.JOIN_WAITLIST,
    errorResponse.code,
    errorResponse
  );
};
