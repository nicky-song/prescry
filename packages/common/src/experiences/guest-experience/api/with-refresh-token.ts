// Copyright 2020 Prescryptive Health, Inc.

import { RequestHeaders } from './api-request-headers';

export interface IRefreshTokenResponse {
  refreshToken?: string;
  refreshDeviceToken?: string;
}

export function withRefreshToken<T extends IRefreshTokenResponse>(
  responseWithData: T,
  response: Response
): T {
  responseWithData.refreshToken =
    response.headers?.get(RequestHeaders.refreshAccountToken) ?? undefined;
  responseWithData.refreshDeviceToken =
    response.headers?.get(RequestHeaders.refreshDeviceToken) ?? undefined;
  return responseWithData;
}
