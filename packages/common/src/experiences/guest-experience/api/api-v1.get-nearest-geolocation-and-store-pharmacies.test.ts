// Copyright 2021 Prescryptive Health, Inc.

import { call, IApiConfig } from '../../../utils/api.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { IGeolocationResponse } from '../../../models/api-response/geolocation-response';
import { locationCoordinatesMock } from '../__mocks__/location-coordinate.mock';
import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorApiResponse } from '../../../errors/error-api-response';
import { ErrorConstants } from '../../../theming/constants';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { getNearestGeolocationAndStorePharmacies } from './api-v1.get-nearest-geolocation-and-store-pharmacies';
import { ILocationCoordinates } from '../../../models/location-coordinates';
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
    geolocationPharmacies: '/geolocation/pharmacies',
  },
};

const mockResponse: IGeolocationResponse = {
  data: { location: locationCoordinatesMock },
  message: '',
  status: 'success',
};

describe('geolocationPharmacies', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    const mockParams: ILocationCoordinates = {
      zipCode: '12345',
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const mockRetryPolicy = {} as IRetryPolicy;
    await getNearestGeolocationAndStorePharmacies(
      mockConfig,
      mockParams,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.geolocationPharmacies}?zipcode=12345&latitude=&longitude=`;
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

  it('makes expected api request with latitude and longitude if exists', async () => {
    const mockParams: ILocationCoordinates = {
      latitude: 10.11,
      longitude: -11.54,
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const mockRetryPolicy = {} as IRetryPolicy;
    await getNearestGeolocationAndStorePharmacies(
      mockConfig,
      mockParams,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.geolocationPharmacies}?zipcode=&latitude=10.11&longitude=-11.54`;
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
      await getNearestGeolocationAndStorePharmacies(mockConfig, undefined);
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }
  });

  it('returns expected response with no zipCode', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const response = await getNearestGeolocationAndStorePharmacies(
      mockConfig,
      {}
    );
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
      await getNearestGeolocationAndStorePharmacies(mockConfig);
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorNotFound,
      APITypes.GEOLOCATION,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});
