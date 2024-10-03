// Copyright 2023 Prescryptive Health, Inc.

import { Response, HeaderInit } from 'node-fetch';
import { Auth0Token } from '../../services/external/tokens';
import { Auth0IdentityConstants } from './auth0-identity-constants';
import { getDataFromUrl } from './get-data-from-url';

export interface IGetDataFromUrlWithAuth0ErrorResponse {
  code: number;
  message: string;
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const getDataFromUrlWithAuth0 = async (
  endpoint: string,
  data: unknown = undefined,
  method: RequestMethod = 'GET',
  headers: HeaderInit = {},
  timeout?: number
): Promise<Response> => {
  const token = await Auth0Token.get();

  const response = await getDataFromUrl(
    endpoint,
    data,
    method,
    buildHeadersWithToken(headers, token),
    timeout
  );

  if (response.ok) {
    return response;
  }

  const clonedResponse = response.clone();

  const errorResponse =
    (await response.json()) as IGetDataFromUrlWithAuth0ErrorResponse;
  if (errorResponse.code !== Auth0IdentityConstants.TOKEN_EXPIRED_CODE) {
    return clonedResponse;
  }

  const newToken = await Auth0Token.get(false);
  return await getDataFromUrl(
    endpoint,
    data,
    method,
    buildHeadersWithToken(headers, newToken),
    timeout
  );
};

const buildHeadersWithToken = (
  headers: HeaderInit,
  token: string
): HeaderInit => ({
  ...headers,
  [Auth0IdentityConstants.AUTHORIZATION_HEADER_KEY]: token,
});
