// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { ILockSlotRequestBody } from '../../../models/api-request-body/lock-slot-request-body';
import { ILockSlotResponse } from '../../../models/api-response/lock-slot-response';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { ErrorConstants } from '../../../theming/constants';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { lockSlot } from './api-v1.lock-slots';
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
    lockSlot: '/provider-location/lock-slot',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const lockSlotRequestBody: ILockSlotRequestBody = {
  locationId: 'locationId',
  startDate: new Date(),
  serviceType: 'servicetype',
  customerPhoneNumber: 'customerphonenumber',
};

const mockResponseData = {
  bookingId: 'bookingId',
  slotExpirationDate: new Date(),
};
const authToken = 'auth-token';
const deviceToken = 'device-token';
const mockResponse: ILockSlotResponse = {
  data: mockResponseData,
  message: 'success',
  status: 'ok',
};

describe('lock slot API call', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await lockSlot(
      mockConfig,
      lockSlotRequestBody,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.lockSlot}`;
    const expectedBody = lockSlotRequestBody;
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
      await lockSlot(
        mockConfig,
        lockSlotRequestBody,
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
      ErrorConstants.errorForLockSlot,
      APITypes.LOCK_SLOT,
      errorCode,
      { code: 1 }
    );
  });
});
