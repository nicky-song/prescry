// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { IFailureResponse } from '../../../models/api-response';
import { IMemberInfoResponse } from '../../../models/api-response/member-info-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  IApiConfig,
  buildUrl,
  buildCommonHeaders,
  call,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { RequestHeaders } from './api-request-headers';
import { IRedirectResponse, handleHttpErrors, APITypes } from './api-v1-helper';
import { EnsureRedirectResponse } from './ensure-api-response/ensure-api-response';
import { ensureGetMemberProfileResponse } from './ensure-api-response/ensure-get-member-profile-response';
import { withRefreshToken } from './with-refresh-token';

export const getMemberProfileInfo = async (
  config: IApiConfig,
  token?: string,
  retryPolicy?: IRetryPolicy,
  deviceToken?: string
): Promise<IMemberInfoResponse | IRedirectResponse> => {
  const url = buildUrl(config, 'members', {});
  const response: Response = await call(
    url,
    null,
    'GET',
    buildCommonHeaders(config, token, deviceToken),
    retryPolicy
  );
  const responseJson = await response.json();
  if (
    response.status === HttpStatusCodes.ACCEPTED &&
    EnsureRedirectResponse(responseJson)
  ) {
    return withRefreshToken<IMemberInfoResponse>(responseJson, response);
  }

  if (response.ok) {
    const contactInfo = ensureGetMemberProfileResponse(responseJson, url);
    const memberInfoRequestId = response.headers.get(
      RequestHeaders.memberInfoRequestId
    );

    try {
      return withRefreshToken<IMemberInfoResponse>(
        {
          ...contactInfo,
          memberInfoRequestId,
        } as IMemberInfoResponse,
        response
      );
    } catch (e) {
      void e;
    }

    return withRefreshToken<IMemberInfoResponse>(
      {
        ...contactInfo,
        memberInfoRequestId,
      } as IMemberInfoResponse,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingMemberContactInfo,
    APITypes.GET_MEMBERS,
    errorResponse.code,
    errorResponse
  );
};
