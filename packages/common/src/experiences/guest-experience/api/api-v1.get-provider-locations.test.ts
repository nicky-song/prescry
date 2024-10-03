// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import {
  IProviderLocationData,
  IProviderLocationResponse,
} from '../../../models/api-response/provider-location-response';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { getProviderLocations } from './api-v1.get-provider-locations';
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

const zipcode = '98052';
const distance = 60;

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    providerLocations: '/provider-locations',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const mockResults: IProviderLocationData = {
  locations: [
    {
      id: '1',
      providerName: 'Bartell Drugs',
      locationName: 'Bartell Drugs',
      address1: '7370 170th Ave NE',
      city: 'Redmond',
      state: 'WA',
      zip: '98052',
      phoneNumber: '(425) 977-5489',
    },
  ],
};
const mockResponse: IProviderLocationResponse = {
  data: mockResults,
  message: '',
  status: 'success',
};
describe('providerLocations', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    const serviceType = 'mock-service-type';
    await getProviderLocations(
      mockConfig,
      undefined,
      undefined,
      authToken,
      mockRetryPolicy,
      deviceToken,
      serviceType
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.providerLocations}?servicetype=${serviceType}`;
    const expectedBody = undefined;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'GET',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('makes expected api request with zipcode and distance', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    const serviceType = 'mock-service-type';
    await getProviderLocations(
      mockConfig,
      zipcode,
      distance,
      authToken,
      mockRetryPolicy,
      deviceToken,
      serviceType
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.providerLocations}?servicetype=${serviceType}&zipcode=${zipcode}&distance=${distance}`;
    const expectedBody = undefined;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'GET',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('makes expected api request without Servicetype', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    await getProviderLocations(
      mockConfig,
      undefined,
      undefined,
      authToken,
      mockRetryPolicy,
      deviceToken
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.providerLocations}`;

    const expectedBody = undefined;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'GET',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('throws expected error if response invalid', async () => {
    const statusCode = HttpStatusCodes.SUCCESS;
    const expectedError = new ErrorApiResponse(
      ErrorConstants.errorInternalServer()
    );

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      status: statusCode,
    });

    try {
      await getProviderLocations(
        mockConfig,
        undefined,
        undefined,
        'auth-token',
        mockRetryPolicy,
        'device-token'
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }
  });

  it('returns expected response', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const response = await getProviderLocations(
      mockConfig,
      undefined,
      undefined,
      'auth-token',
      mockRetryPolicy,
      'device-token'
    );
    expect(response).toEqual(mockResponse);
  });

  it('returns expected response with zipcode and distance passed in', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const response = await getProviderLocations(
      mockConfig,
      zipcode,
      distance,
      'auth-token',
      mockRetryPolicy,
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

    const response = await getProviderLocations(
      mockConfig,
      undefined,
      undefined,
      'auth-token',
      mockRetryPolicy,
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
      await getProviderLocations(
        mockConfig,
        undefined,
        undefined,
        'auth-token',
        mockRetryPolicy,
        'device-token'
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForGettingProviderLocations,
      APITypes.PROVIDER_LOCATIONS,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});
