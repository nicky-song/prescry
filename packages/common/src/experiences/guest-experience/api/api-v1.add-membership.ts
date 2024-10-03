// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse, IApiResponse } from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildUrl,
  call,
  IApiConfig,
  buildCommonHeaders,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { withRefreshToken } from './with-refresh-token';
import { IMemberLoginState } from '../store/member-login/member-login-reducer';
import { ensureAddMembershipResponse } from './ensure-api-response/ensure-add-membership-response';

export const addMembership = async (
  config: IApiConfig,
  memberLoginInfo: IMemberLoginState,
  deviceToken?: string,
  accountToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IApiResponse> => {
  const url = buildUrl(config, 'members', {});
  const response: Response = await call(
    url,
    memberLoginInfo,
    'POST',
    buildCommonHeaders(config, accountToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();

  if (response.ok && ensureAddMembershipResponse(responseJson)) {
    return withRefreshToken<IApiResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorInUpdatingMemberInfo,
    APITypes.ADD_MEMBERSHIP,
    errorResponse.code,
    errorResponse
  );
};
