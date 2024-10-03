// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { RequestHeaders } from './api-request-headers';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { unlockSlot } from './api-v1.unlock-slots';

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
    unlockSlot: '/provider-location/unlock-slot/:id',
  },
};

const authToken = 'auth-token';
const deviceToken = 'device-token';
const mockResponse = {
  message: 'success',
  status: 'ok',
};

const bookingId = 'mock-booking-id';
const mockRetryPolicy = {} as IRetryPolicy;

describe('unlock slot API call', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await unlockSlot(
      mockConfig,
      bookingId,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/provider-location/unlock-slot/${bookingId}`;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      undefined,
      'DELETE',
      expectedHeaders,
      mockRetryPolicy
    );
    expect(mockHandleHttpErrors).not.toBeCalled();
  });
  it('throws expected error if response failed', async () => {
    const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const expectedError = Error('failed');
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
      await unlockSlot(
        mockConfig,
        bookingId,
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
      ErrorConstants.errorForUnlockSlot,
      APITypes.UNLOCK_SLOT,
      errorCode,
      { code: 1 }
    );
  });
});
