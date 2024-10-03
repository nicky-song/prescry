// Copyright 2021 Prescryptive Health, Inc.

import { call, IApiConfig } from '../../../utils/api.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { getNearestGeolocation } from './api-v1.get-nearest-geolocation';
import { IGeolocationResponse } from '../../../models/api-response/geolocation-response';
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
    geolocation: '/geolocation',
  },
};

const mockResponse: IGeolocationResponse = {
  data: { location: locationCoordinatesMock },
  message: '',
  status: 'success',
};
const mockParams = {
  latitude: 10,
  longitude: 1,
};
describe('geolocation', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const mockRetryPolicy = {} as IRetryPolicy;
    await getNearestGeolocation(mockConfig, mockParams, mockRetryPolicy);

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.geolocation}?zipcode=&latitude=10&longitude=1`;
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
      await getNearestGeolocation(mockConfig, undefined);
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }
  });

  it('returns expected response with coordinates passed in', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const response = await getNearestGeolocation(mockConfig, mockParams);
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
      await getNearestGeolocation(mockConfig);
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
