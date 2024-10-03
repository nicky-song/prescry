// Copyright 2021 Prescryptive Health, Inc.

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
import { IRefreshTokenResponse, withRefreshToken } from './with-refresh-token';

export const unlockSlot = async (
  config: IApiConfig,
  bookingId: string,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IRefreshTokenResponse> => {
  const url = buildUrl(config, 'unlockSlot', {
    ':id': bookingId,
  });

  const response: Response = await call(
    url,
    undefined,
    'DELETE',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();

  if (response.ok) {
    return withRefreshToken(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForUnlockSlot,
    APITypes.UNLOCK_SLOT,
    errorResponse.code,
    errorResponse
  );
};
