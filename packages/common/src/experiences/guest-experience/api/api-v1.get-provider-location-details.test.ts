// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { RequestHeaders } from './api-request-headers';
import {
  ILocation,
  IProviderLocationDetailsResponse,
} from '../../../models/api-response/provider-location-details-response';
import { getProviderLocationDetails } from './api-v1.get-provider-location-details';
import { IServiceInfo } from '../../../models/api-response/provider-location-details-response';

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

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    providerLocationDetails: '/provider-location/:identifier',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const mockResults: ILocation = {
  id: '1',
  providerName: 'Bartell Drugs',
  locationName: 'Bartell Drugs',
  address1: '7370 170th Ave NE',
  city: 'Redmond',
  state: 'WA',
  zip: '98052',
  phoneNumber: '(425) 977-5489',
  serviceInfo: {} as IServiceInfo[],
  timezone: 'PDT',
};
const mockResponse: IProviderLocationDetailsResponse = {
  data: {
    location: mockResults,
    serviceNameMyRx: 'mock-service-name',
    minimumAge: 3,
    aboutQuestionsDescriptionMyRx: 'mock-about-question-desc',
    aboutDependentDescriptionMyRx: 'mock-about-dep-desc',
    cancellationPolicyMyRx: 'mock-cancellation-policy',
  },
  message: '',
  status: 'success',
};

const serviceType = 'mock-service-type';
const identifier = '1';

describe('providerLocationDetails', () => {
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
    await getProviderLocationDetails(
      mockConfig,
      serviceType,
      identifier,
      authToken,
      mockRetryPolicy,
      deviceToken
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/provider-location/${mockResults.id}?servicetype=${serviceType}`;
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
      await getProviderLocationDetails(
        mockConfig,
        serviceType,
        identifier,
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

    const response = await getProviderLocationDetails(
      mockConfig,
      serviceType,
      identifier,
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

    const response = await getProviderLocationDetails(
      mockConfig,
      serviceType,
      identifier,
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
      await getProviderLocationDetails(
        mockConfig,
        serviceType,
        identifier,
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
      ErrorConstants.errorForGettingProviderLocationDetails,
      APITypes.PROVIDER_LOCATION_DETAILS,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});
