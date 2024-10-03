// Copyright 2018 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../errors/error-codes';
import { getEndpointRetryPolicy } from './get-endpoint.retry-policy';
import { IRetryPolicy } from './retry-policy.helper';

describe('getEndpointRetryPolicy', () => {
  it('should have pause time as 1000 and remaining count as 3 by default', () => {
    expect(getEndpointRetryPolicy.pause).toBe(1000);
    expect(getEndpointRetryPolicy.remaining).toBe(3);
  });
  it('getEndpointRetryPolicy.getNextRetry: should return policy with double pause time and decrease remaining counter by 1 if api response is 500', () => {
    const mockNext = jest.fn();
    const mockPolicy = {
      getNextRetry: mockNext,
      pause: 1000,
      remaining: 3,
    } as IRetryPolicy;
    const mockResponse = {
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    } as Response;

    const result = getEndpointRetryPolicy.getNextRetry(
      mockResponse,
      mockPolicy
    );

    expect(result.pause).toBe(mockPolicy.pause * 2);
    expect(result.remaining).toBe(mockPolicy.remaining - 1);
    expect(result.getNextRetry).toBe(mockNext);
  });

  it('getEndpointRetryPolicy.getNextRetry: should return policy with pause time and remaining counter 0 if api response is success', () => {
    const mockNext = jest.fn();
    const mockPolicy = {
      getNextRetry: mockNext,
      pause: 1000,
      remaining: 3,
    } as IRetryPolicy;
    const mockResponse = { status: HttpStatusCodes.SUCCESS } as Response;

    const result = getEndpointRetryPolicy.getNextRetry(
      mockResponse,
      mockPolicy
    );

    expect(result.pause).toBe(0);
    expect(result.remaining).toBe(0);
    expect(result.getNextRetry).toBe(mockNext);
  });
  it('getEndpointRetryPolicy.getNextRetry: should return policy with pause time and remaining counter 0 if api response is 404 failure', () => {
    const mockNext = jest.fn();
    const mockPolicy = {
      getNextRetry: mockNext,
      pause: 1000,
      remaining: 3,
    } as IRetryPolicy;
    const mockResponse = {
      status: HttpStatusCodes.FORBIDDEN_ERROR,
    } as Response;

    const result = getEndpointRetryPolicy.getNextRetry(
      mockResponse,
      mockPolicy
    );

    expect(result.pause).toBe(0);
    expect(result.remaining).toBe(0);
    expect(result.getNextRetry).toBe(mockNext);
  });
  it('getEndpointRetryPolicy.getNextRetry: should return policy with double pause time and decrease remaining counter by 1 if api response is error', () => {
    const mockNext = jest.fn();
    const mockPolicy = {
      getNextRetry: mockNext,
      pause: 1000,
      remaining: 3,
    } as IRetryPolicy;

    const error = new Error('TypeError: Failed to fetch');

    const result = getEndpointRetryPolicy.getNextRetry(
      error as unknown as Response,
      mockPolicy
    );

    expect(result.pause).toBe(mockPolicy.pause * 2);
    expect(result.remaining).toBe(mockPolicy.remaining - 1);
    expect(result.getNextRetry).toBe(mockNext);
  });
});
