// Copyright 2022 Prescryptive Health, Inc.

import { call, IApiConfig } from '../../../utils/api.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { autocompleteGeolocation } from './api-v1.autocomplete-geolocation';
import { IGeolocationAutocompleteResponse } from '../../../models/api-response/geolocation-response';
import { locationCoordinatesMock } from '../__mocks__/location-coordinate.mock';
import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorApiResponse } from '../../../errors/error-api-response';
import { ErrorConstants } from '../../../theming/constants';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
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

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    geolocationAutocomplete: '/geolocation/autocomplete',
  },
};

const mockResponse: IGeolocationAutocompleteResponse = {
  data: { locations: [locationCoordinatesMock] },
  message: '',
  status: 'success',
};
const mockQuery = '20032';
const mockLatitude = 47.677255;
const mockLongitude = -122.1652;
describe('autocompleteGeolocation', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request with query', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const mockRetryPolicy = {} as IRetryPolicy;
    await autocompleteGeolocation(
      mockConfig,
      mockQuery,
      locationCoordinatesMock,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.geolocationAutocomplete}?query=${mockQuery}`;
    const expectedBody = undefined;
    const expectedHeaders = {
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

  it('makes expected api request with location', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const mockRetryPolicy = {} as IRetryPolicy;
    await autocompleteGeolocation(
      mockConfig,
      undefined,
      {
        longitude: mockLongitude,
        latitude: mockLatitude,
      },
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.geolocationAutocomplete}?query=${mockLongitude},${mockLatitude}`;
    const expectedBody = undefined;
    const expectedHeaders = {
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
      await autocompleteGeolocation(mockConfig, undefined);
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }
  });

  it('returns expected response with query passed in', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const response = await autocompleteGeolocation(mockConfig, mockQuery);
    expect(response).toEqual(mockResponse);
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
      await autocompleteGeolocation(mockConfig);
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorNotFound,
      APITypes.AUTOCOMPLETE_GEOLOCATION,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});
