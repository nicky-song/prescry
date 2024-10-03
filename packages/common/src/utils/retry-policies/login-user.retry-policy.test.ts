// Copyright 2020 Prescryptive Health, Inc.

import { loginMemberRetryPolicy } from './login-user.retry-policy';
import { IRetryPolicy } from './retry-policy.helper';
import { HttpStatusCodes } from '../../errors/error-codes';

describe('loginMemberRetryPolicy', () => {
  it('has expected default policy', () => {
    expect(loginMemberRetryPolicy.pause).toBe(2000);
    expect(loginMemberRetryPolicy.remaining).toBe(3);
  });

  it('getNextRetry: returns expected policy if api response is error', () => {
    const mockNext = jest.fn();
    const mockPolicy = {
      getNextRetry: mockNext,
      pause: 1000,
      remaining: 3,
    } as IRetryPolicy;

    const error = new Error('TypeError: Failed to fetch');

    const result = loginMemberRetryPolicy.getNextRetry(
      error as unknown as Response,
      mockPolicy
    );

    expect(result.pause).toBe(mockPolicy.pause * 2);
    expect(result.remaining).toBe(mockPolicy.remaining - 1);
    expect(result.getNextRetry).toBe(mockNext);
  });

  it('getNextRetry: returns expected policy for successful API response', () => {
    const mockNext = jest.fn();
    const mockPolicy = {
      getNextRetry: mockNext,
      pause: 1000,
      remaining: 3,
    } as IRetryPolicy;
    const mockResponse = { ok: true } as Response;

    const result = loginMemberRetryPolicy.getNextRetry(
      mockResponse,
      mockPolicy
    );

    expect(result.pause).toBe(0);
    expect(result.remaining).toBe(0);
    expect(result.getNextRetry).toBe(mockNext);
  });

  it('getNextRetry: returns expected policy for 404 API response', () => {
    const mockNext = jest.fn();
    const mockPolicy = {
      getNextRetry: mockNext,
      pause: 1000,
      remaining: 3,
    } as IRetryPolicy;
    const mockResponse = {
      status: HttpStatusCodes.FORBIDDEN_ERROR,
    } as Response;

    const result = loginMemberRetryPolicy.getNextRetry(
      mockResponse,
      mockPolicy
    );

    expect(result.pause).toBe(0);
    expect(result.remaining).toBe(0);
    expect(result.getNextRetry).toBe(mockNext);
  });

  it('getNextRetry: returns expected policy for 503 API response', () => {
    const mockNext = jest.fn();
    const mockPolicy = {
      getNextRetry: mockNext,
      pause: 1000,
      remaining: 3,
    } as IRetryPolicy;
    const mockResponse = {
      status: HttpStatusCodes.SERVICE_UNAVAILABLE,
    } as Response;

    const result = loginMemberRetryPolicy.getNextRetry(
      mockResponse,
      mockPolicy
    );

    expect(result.pause).toBe(mockPolicy.pause * 2);
    expect(result.remaining).toBe(mockPolicy.remaining - 1);
    expect(result.getNextRetry).toBe(mockNext);
  });
});
