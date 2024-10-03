// Copyright 2023 Prescryptive Health, Inc.

import fetch, {
  RequestInfo,
  Response,
  HeaderInit,
  RequestInit,
} from 'node-fetch';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const getDataFromUrl = async (
  endpoint: string,
  data: unknown = undefined,
  method: RequestMethod = 'GET',
  headers: HeaderInit = {},
  timeout?: number
): Promise<Response> => {
  const url: RequestInfo = `${endpoint}`;

  const headerContent: HeaderInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };

  const body =
    isBodySupportedForMethod(method) && data ? JSON.stringify(data) : undefined;

  const options: RequestInit = {
    body,
    headers: headerContent,
    method,
    timeout,
  };

  const response: Response = await fetch(url, options);
  return response;
};

const isBodySupportedForMethod = (method: RequestMethod): boolean =>
  method === 'POST' || method === 'PUT' || method === 'PATCH';
