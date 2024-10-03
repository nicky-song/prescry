// Copyright 2021 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IProcessInviteCodeResponse } from '../../../models/api-response/process-invite-code.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureProcessInviteCodeDetailsResponse } from './ensure-api-response/ensure-process-invite-code-details-response';
import { withRefreshToken } from './with-refresh-token';

export const processInviteCode = async (
  config: IApiConfig,
  inviteCode: string,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IProcessInviteCodeResponse> => {
  const url = buildUrl(config, 'inviteCode', { ':code': inviteCode });

  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );
  const responseJson = await response.json();
  if (response.ok && ensureProcessInviteCodeDetailsResponse(responseJson)) {
    return withRefreshToken<IProcessInviteCodeResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingInviteCodeDetails,
    APITypes.PROCESS_INVITE_CODE,
    undefined,
    errorResponse
  );
};
