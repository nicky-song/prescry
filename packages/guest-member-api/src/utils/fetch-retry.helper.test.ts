// Copyright 2021 Prescryptive Health, Inc.

import fetch, { RequestInit } from 'node-fetch';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  defaultRetryPolicy,
  fetchRetry,
  IRetryPolicy,
} from './fetch-retry.helper';

jest.mock('node-fetch');

const fetchMock = fetch as unknown as jest.Mock;
const mockUrlString = 'mockurl';

let retryPolicyMock: IRetryPolicy = { ...defaultRetryPolicy, pause: 100 };

describe('fetchRetry with mock fetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    retryPolicyMock = { ...defaultRetryPolicy, pause: 100 };
  });

  it('should fetch once on success 200', async () => {
    const status = 200;
    fetchMock.mockResolvedValue({
      ok: true,
      status,
    });
    const options: Partial<RequestInit> = { method: 'GET' };
    await fetchRetry(mockUrlString, options, retryPolicyMock);
  });

  it('should retry on INTERNAL_SERVER_ERROR', async () => {
    const status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    fetchMock.mockResolvedValue({
      ok: true,
      status,
    });
    const options: Partial<RequestInit> = { method: 'GET' };
    try {
      await fetchRetry(mockUrlString, options, retryPolicyMock);
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(fetchMock).toHaveBeenCalledTimes(retryPolicyMock.remaining + 1);
    }
  });

  it('should fetch on retry on SERVICE_UNAVAILABLE', async () => {
    const status = HttpStatusCodes.SERVICE_UNAVAILABLE;
    fetchMock.mockResolvedValue({
      ok: true,
      status,
    });
    const options: Partial<RequestInit> = { method: 'GET' };
    try {
      await fetchRetry(mockUrlString, options, retryPolicyMock);
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(fetchMock).toHaveBeenCalledTimes(retryPolicyMock.remaining + 1);
    }
  });

  it('should fetch on retry on TOO_MANY_REQUESTS', async () => {
    const status = HttpStatusCodes.TOO_MANY_REQUESTS;
    fetchMock.mockResolvedValue({
      ok: true,
      status,
    });
    const options: Partial<RequestInit> = { method: 'GET' };
    try {
      await fetchRetry(mockUrlString, options, retryPolicyMock);
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(fetchMock).toHaveBeenCalledTimes(retryPolicyMock.remaining + 1);
    }
  });

  it('should retry on Error raised', async () => {
    fetchMock.mockImplementation(() => {
      throw new Error('Mock error');
    });
    const options: Partial<RequestInit> = { method: 'GET' };
    try {
      await fetchRetry(mockUrlString, options, retryPolicyMock);
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(fetchMock).toHaveBeenCalledTimes(retryPolicyMock.remaining + 1);
    }
  });

  it('should retry with custom retry policy retry count on Error raised', async () => {
    fetchMock.mockImplementation(() => {
      throw new Error('Mock error');
    });
    const options: Partial<RequestInit> = { method: 'GET' };
    const retryTimes = 1;
    const customRetryPolicy: IRetryPolicy = {
      ...retryPolicyMock,
      remaining: retryTimes,
    };
    try {
      await fetchRetry(mockUrlString, options, customRetryPolicy);
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(fetchMock).toHaveBeenCalledTimes(retryTimes + 1);
    }
  });

  it('should retry with custom retry policy retry pause on Error raised', async () => {
    fetchMock.mockImplementation(() => {
      throw new Error('Mock error');
    });
    const options: Partial<RequestInit> = { method: 'GET' };
    const startTime = Date.now();
    try {
      await fetchRetry(mockUrlString, options, retryPolicyMock);
      fail('Expected exception but none thrown!');
    } catch (error) {
      const endTime = Date.now();
      expect(fetchMock).toHaveBeenCalledTimes(retryPolicyMock.remaining + 1);
      const difference = endTime.valueOf() - startTime;
      expect(difference).toBeGreaterThanOrEqual(
        retryPolicyMock.pause * retryPolicyMock.remaining
      );
    }
  });
});
