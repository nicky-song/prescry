// Copyright 2023 Prescryptive Health, Inc.

import { HeaderInit } from 'node-fetch';
import { Auth0Audience } from '../auth0/auth0.helper';
import { IAuth0Config } from '../configuration';
import { IRetryPolicy } from './fetch-retry.helper';
import { RequestMethod } from './get-data-from-url';

export const getDataFromUrlWithAuth0Mock = (
  audience: Auth0Audience,
  auth0Config: IAuth0Config,
  endpoint: string,
  data: unknown = undefined,
  method: RequestMethod = 'GET',
  headers: HeaderInit = {},
  logRequestBody = true,
  timeout: number,
  retryPolicy?: IRetryPolicy
): Response => {
  const responseMock: Partial<Response> = {
    ok: true,
  };

  if (
    audience &&
    auth0Config &&
    endpoint &&
    data &&
    method &&
    headers &&
    logRequestBody &&
    timeout &&
    retryPolicy
  ) {
    return responseMock as Response;
  }
  return responseMock as Response;
};
