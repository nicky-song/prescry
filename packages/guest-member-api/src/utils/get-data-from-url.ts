// Copyright 2020 Prescryptive Health, Inc.

import { fetchRetry, IRetryPolicy } from './fetch-retry.helper';
import { logExternalApiRequestBody } from './custom-event-helper';
import { RequestInfo, Response, HeaderInit, RequestInit } from 'node-fetch';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const getDataFromUrl = async (
  endpoint: string,
  data: unknown = undefined,
  method: RequestMethod = 'GET',
  headers: HeaderInit = {},
  logRequestBody = true,
  timeout?: number,
  retryPolicy?: IRetryPolicy
): Promise<Response> => {
  const url: RequestInfo = `${endpoint}`;

  const headerContent: HeaderInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };

  if (isBodySupportedForMethod(method) && data && logRequestBody) {
    logExternalApiRequestBody(url, JSON.stringify(data));
  }

  const body =
    isBodySupportedForMethod(method) && data ? JSON.stringify(data) : undefined;

  const options: Partial<RequestInit> = {
    body,
    headers: headerContent,
    method,
    timeout,
  };

  const response: Response = await fetchRetry(url, options, retryPolicy);
  return response;
};

const isBodySupportedForMethod = (method: RequestMethod): boolean =>
  method === 'POST' || method === 'PUT' || method === 'PATCH';
