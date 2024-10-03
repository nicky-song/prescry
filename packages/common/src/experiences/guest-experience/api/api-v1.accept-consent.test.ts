// Copyright 2020 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { acceptConsent } from './api-v1.accept-consent';
import { RequestHeaders } from './api-request-headers';

jest.mock('../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('./api-v1-helper', () => ({
  ...(jest.requireActual('./api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;
const mockRetryPolicy = {} as IRetryPolicy;
const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    acceptConsent: '/consent',
  },
};

const mockResponse = {
  message: '',
  status: 'success',
};
describe('acceptConsent', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request without servicetype', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    await acceptConsent(mockConfig, mockRetryPolicy, authToken, deviceToken);

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.acceptConsent}`;
    const expectedBody = {};
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('makes expected api request with servicetype as query parameter', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    const servicetype = 'mock-service-type';

    await acceptConsent(
      mockConfig,
      mockRetryPolicy,
      authToken,
      deviceToken,
      servicetype
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.acceptConsent}?servicetype=${servicetype}`;
    const expectedBody = {};
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('returns expected response', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const response = await acceptConsent(
      mockConfig,
      mockRetryPolicy,
      'auth-token',
      'device-token'
    );
    expect(response).toEqual(mockResponse);
  });

  it('includes refresh token in response', async () => {
    const refreshToken = 'refresh-token';
    const headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);

    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
      headers,
    });

    const response = await acceptConsent(
      mockConfig,
      mockRetryPolicy,
      'auth-token',
      'device-token'
    );

    expect(response.refreshToken).toEqual(refreshToken);
  });

  it('throws expected error if response failed', async () => {
    const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const expectedError = Error('Failed');
    const errorCode = 1;

    mockCall.mockResolvedValue({
      json: () => ({
        code: errorCode,
      }),
      ok: false,
      status: statusCode,
    });

    mockHandleHttpErrors.mockReturnValue(expectedError);

    try {
      await acceptConsent(
        mockConfig,
        mockRetryPolicy,
        'auth-token',
        'device-token'
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForConsent,
      APITypes.ACCEPT_CONSENT,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});
