// Copyright 2018 Prescryptive Health, Inc.

import { RequestHeaders } from '../experiences/guest-experience/api/api-request-headers';
import {
  getPolicy,
  IDefaultPolicyTemplates,
  IRetryPolicy,
} from './retry-policies/retry-policy.helper';
import { ErrorApiResponse } from '../errors/error-api-response';
import { ErrorConstants } from '../theming/constants';

export type IApiConfigKeys = 'host' | 'port' | 'protocol' | 'version' | 'url';
export type IApiConfigEnv = { [key in IApiConfigKeys]: string };

export interface IApiConfig {
  env: IApiConfigEnv;
  paths: { [key: string]: string };
  useMock?: boolean;
  retryPolicy?: {
    pause: number;
    remaining: number;
  };
  switches?: string;
}

export type ITelemetryConfig = Record<
  'instrumentationKey' | 'serviceName',
  string
>;

export interface IConfigState<TApiNames extends string> {
  allowedActionTypeList?: string[];
  apis: { [key in TApiNames]: IApiConfig };
  auth: {
    clientId: string;
    tenantId: string;
  };
  telemetry: ITelemetryConfig;
  currentDate: Date;
  location?: ILocation;
  memberTerms?: string[];
}

export interface ILocation {
  /**
   * Returns the Location object's URL's fragment (includes leading "#" if non-empty).
   * Can be set, to navigate to the same URL with a changed fragment (ignores leading "#").
   */
  hash: string;
  /**
   * Returns the Location object's URL's host and port (if different from the default
   * port for the scheme).
   * Can be set, to navigate to the same URL with a changed host and port.
   */
  host: string;
  /**
   * Returns the Location object's URL.
   * Can be set, to navigate to the given URL.
   */
  href: string;
  /**
   * Returns the Location object's URL's path.
   * Can be set, to navigate to the same URL with a changed path.
   */
  pathname: string;
  /**
   * Returns the Location object's URL's scheme.
   * Can be set, to navigate to the same URL with a changed scheme.
   */
  protocol: string;
  /**
   * Returns the Location object's URL's query (includes leading "?" if non-empty).
   * Can be set, to navigate to the same URL with a changed query (ignores leading "?").
   */
  search: string;
}

export function buildUrl(
  config: IApiConfig,
  path: string,
  args: { [key: string]: string },
  additionalParams?: string
) {
  let pathValue = config.paths[path] + (additionalParams ?? '');
  Object.keys(args).forEach((arg) => {
    pathValue = pathValue.replace(arg, args[arg]);
  });

  const url = `${config.env.protocol}://${config.env.host}:${config.env.port}${config.env.url}${pathValue}`;
  return url;
}
export interface ICommonHeaders {
  [key: string]: string;
}

export const buildCommonHeaders = (
  config: IApiConfig,
  accountToken?: string,
  deviceToken?: string
) => {
  const headers: ICommonHeaders = {};

  if (accountToken) {
    headers[RequestHeaders.authorization] = accountToken;
  }

  if (deviceToken) {
    headers[RequestHeaders.deviceTokenRequestHeader] = deviceToken;
  }

  if (config.switches) {
    headers[RequestHeaders.switches] = (config.switches || '')
      .trim()
      .replace(/^\?/, '');
  }

  if (config.env.version) {
    headers[RequestHeaders.apiVersion] = config.env.version;
  }

  return headers;
};

export function buildAuthHeaders(authToken: string): Record<string, string> {
  return {
    [RequestHeaders.authorization]: `Bearer ${authToken}`,
  };
}

export async function call(
  endpoint: string,
  data: unknown = null,
  method = 'GET',
  header = {},
  retryPolicy?: IRetryPolicy
): Promise<Response> {
  const url = `${endpoint}`;

  const headerContent = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...header,
  };

  const requestOptions = {
    body:
      ((method === 'POST' || method === 'PUT') &&
        data &&
        JSON.stringify(data)) ||
      null,

    headers: new Headers(headerContent),
    method,
  } as Partial<RequestInit>;

  const result = await fetchRetry(url, requestOptions, fetch, retryPolicy);
  return result;
}

export const pause = (duration: number) =>
  new Promise((res) => setTimeout(res, duration));

export const fetchRetry = async (
  url: string,
  options: Partial<RequestInit>,
  fetcher: (
    input: RequestInfo,
    init?: RequestInit | undefined
  ) => Promise<Response>,
  retryPolicy?: IRetryPolicy
): Promise<Response> => {
  const method = options.method as keyof IDefaultPolicyTemplates;
  retryPolicy = retryPolicy || getPolicy(method);

  let response;
  do {
    try {
      response = await fetcher(url, options);

      if (response.ok) {
        return response;
      }

      await pause(retryPolicy.pause);

      retryPolicy = retryPolicy.getNextRetry(response, retryPolicy);
    } catch (error) {
      if (retryPolicy.remaining <= 1) {
        throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
      }
      await pause(retryPolicy.pause);
      retryPolicy = retryPolicy.getNextRetry(error as Response, retryPolicy);
      return await fetchRetry(url, options, fetcher, retryPolicy);
    }
  } while (retryPolicy.remaining > 0);

  return response;
};
