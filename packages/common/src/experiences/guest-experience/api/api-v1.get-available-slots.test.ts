// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { getAvailableSlots } from './api-v1.get-available-slots';
import { IAvailableSlotsResponse } from '../../../models/api-response/available-slots-response';
import { IAvailableSlotsRequestBody } from '../../../models/api-request-body/available-slots.request-body';
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
    availableSlots: '/provider-location/get-availability',
  },
};
const authToken = 'auth-token';
const deviceToken = 'device-token';
const mockRetryPolicy = {} as IRetryPolicy;

const availableSlotRequestBody: IAvailableSlotsRequestBody = {
  locationId: 'mock-location-id',
  serviceType: 'mock-service-type',
  start: '2020-06-22T08:00:00',
  end: '2020-06-30T08:00:00',
};

const mockResponse: IAvailableSlotsResponse = {
  data: {
    slots: [
      {
        start: '2020-06-22T08:00:00',
        day: '2020-06-22',
        slotName: '8:15 am',
      },
    ],
    unAvailableDays: ['2020-06-23'],
  },
  message: '',
  status: 'success',
};

describe('getAvailableSlots', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getAvailableSlots(
      mockConfig,
      availableSlotRequestBody,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.availableSlots}`;
    const expectedBody = availableSlotRequestBody;
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
      await getAvailableSlots(
        mockConfig,
        availableSlotRequestBody,
        authToken,
        deviceToken,
        mockRetryPolicy
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

    const response = await getAvailableSlots(
      mockConfig,
      availableSlotRequestBody,
      authToken,
      deviceToken,
      mockRetryPolicy
    );
    const expectedResponse = {
      slots: [
        {
          start: '2020-06-22T08:00:00',
          slotName: '8:15 am',
          day: '2020-06-22',
        },
      ],
      markedDates: {
        '2020-06-23': {
          disabled: true,
          disableTouchEvent: true,
        },
      },
    };

    expect(response).toEqual(expectedResponse);
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

    const response = await getAvailableSlots(
      mockConfig,
      availableSlotRequestBody,
      authToken,
      deviceToken,
      mockRetryPolicy
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
      await getAvailableSlots(
        mockConfig,
        availableSlotRequestBody,
        authToken,
        deviceToken,
        mockRetryPolicy
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorInGettingAvailableSlots,
      APITypes.AVAILABLE_SLOTS,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});
