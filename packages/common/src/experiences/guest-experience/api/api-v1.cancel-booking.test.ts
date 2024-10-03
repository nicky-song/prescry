// Copyright 2020 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { ICancelBookingResponse } from '../../../models/api-response/cancel-booking-response';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { cancelBooking } from './api-v1.cancel-booking';
import { ICancelBookingRequestBody } from '../../../models/api-request-body/cancel-booking.request-body';
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
    cancelBooking: '/cancel-booking',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const cancelBookingRequestBody = {
  orderNumber: '1234',
} as ICancelBookingRequestBody;

const mockResponse: ICancelBookingResponse = {
  message: 'all good',
  status: 'ok',
};

describe('cancel booking', () => {
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
    await cancelBooking(
      mockConfig,
      cancelBookingRequestBody,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.cancelBooking}`;
    const expectedBody = cancelBookingRequestBody;
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

    const response = await cancelBooking(
      mockConfig,
      cancelBookingRequestBody,
      'auth-token',
      'device-token',
      mockRetryPolicy
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
      await cancelBooking(
        mockConfig,
        cancelBookingRequestBody,
        'auth-token',
        'device-token',
        mockRetryPolicy
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForCancelBooking,
      APITypes.CANCEL_BOOKING,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});
