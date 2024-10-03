// Copyright 2022 Prescryptive Health, Inc.

import fetch, { RequestInit, Response } from 'node-fetch';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ApiConstants } from '../constants/api-constants';

export interface IRetryPolicy {
  remaining: number;
  pause: number;
}

export const defaultRetryPolicy: IRetryPolicy = {
  remaining: ApiConstants.RETRY_POLICY_DEFAULT_RETRIES,
  pause: ApiConstants.RETRY_POLICY_DEFAULT_PAUSE,
};

export const defaultNoRetryPolicy: IRetryPolicy = {
  remaining: 0,
  pause: ApiConstants.RETRY_POLICY_DEFAULT_PAUSE,
};

export async function fetchRetry(
  url: string,
  options: Partial<RequestInit>,
  retryPolicy?: IRetryPolicy
): Promise<Response> {
  const pause: number = retryPolicy
    ? retryPolicy.pause
    : defaultNoRetryPolicy.pause;
  let retryCount: number = retryPolicy
    ? retryPolicy.remaining
    : defaultNoRetryPolicy.remaining;
  const init: RequestInit = {
    timeout: ApiConstants.RETRY_POLICY_DEFAULT_TIMEOUT,
    ...options,
  };
  do {
    try {
      const response: Response = await fetch(url, init);
      switch (response.status) {
        case HttpStatusCodes.INTERNAL_SERVER_ERROR:
        case HttpStatusCodes.SERVICE_UNAVAILABLE:
        case HttpStatusCodes.TOO_MANY_REQUESTS:
          throw new Error(
            'Caught retryable HTTP error code: ' + response.status
          );
        default:
          return response;
      }
    } catch (error) {
      if (retryCount === 0) {
        throw error;
      }
      retryCount = retryCount - 1;
    }
    await new Promise((res) => setTimeout(res, pause));
    // eslint-disable-next-line no-constant-condition
  } while (true);
}
