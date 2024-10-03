// Copyright 2020 Prescryptive Health, Inc.

import { IRetryPolicy } from './fetch-retry.helper';
import { Response, HeaderInit } from 'node-fetch';
import { Auth0Audience, getAuth0Token } from '../auth0/auth0.helper';
import { IAuth0Config } from '../configuration';
import { ApiConstants } from '../constants/api-constants';
import { getDataFromUrl, RequestMethod } from './get-data-from-url';

export const TOKEN_EXPIRED_CODE = 103;

export interface IGetDataFromUrlWithAuth0ErrorResponse {
  code: number;
  message: string;
}

export const getDataFromUrlWithAuth0 = async (
  audience: Auth0Audience,
  auth0Config: IAuth0Config,
  endpoint: string,
  data: unknown = undefined,
  method: RequestMethod = 'GET',
  headers: HeaderInit = {},
  logRequestBody = true,
  timeout?: number,
  retryPolicy?: IRetryPolicy
): Promise<Response> => {
  const token = await getAuth0Token(audience, auth0Config);

  const response = await getDataFromUrl(
    endpoint,
    data,
    method,
    buildHeadersWithToken(headers, token),
    logRequestBody,
    timeout,
    retryPolicy
  );

  if (response.ok) {
    return response;
  }

  const clonedResponse = response.clone();

  const errorResponse =
    (await response.json()) as IGetDataFromUrlWithAuth0ErrorResponse;
  if (errorResponse.code !== TOKEN_EXPIRED_CODE) {
    return clonedResponse;
  }

  const newToken = await getAuth0Token(audience, auth0Config, false);
  return await getDataFromUrl(
    endpoint,
    data,
    method,
    buildHeadersWithToken(headers, newToken),
    logRequestBody,
    timeout,
    retryPolicy
  );
};

const buildHeadersWithToken = (
  headers: HeaderInit,
  token: string
): HeaderInit => ({
  ...headers,
  [ApiConstants.AUTHORIZATION_HEADER_KEY]: token,
});
