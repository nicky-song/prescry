// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IFeedResponse } from '../../../models/api-response/feed-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureFeedResponse } from './ensure-api-response/ensure-feed-response';
import { withRefreshToken } from './with-refresh-token';

export const getFeed = async (
  config: IApiConfig,
  authToken?: string,
  retryPolicy?: IRetryPolicy,
  deviceToken?: string
): Promise<IFeedResponse> => {
  const url = buildUrl(config, 'feed', {});

  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureFeedResponse(responseJson)) {
    return withRefreshToken<IFeedResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingFeed,
    APITypes.FEED,
    errorResponse.code,
    errorResponse
  );
};
