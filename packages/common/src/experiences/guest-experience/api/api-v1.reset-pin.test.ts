// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { IResetPinRequestBody } from '../../../models/api-request-body/reset-pin.request-body';
import { IResetPinResponse } from '../../../models/api-response/reset-pin.response';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { ErrorConstants } from '../../../theming/constants';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { resetPin } from './api-v1.reset-pin';
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
    resetPin: '/pin-reset/reset',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const resetPinRequestBody: IResetPinRequestBody = {
  verificationType: 'EMAIL',
  code: '123456',
  maskedValue: 'x***x@g.com',
};

const mockResponseData = {
  deviceToken: 'test;',
};
const authToken = 'auth-token';
const deviceToken = 'device-token';
const mockResponse: IResetPinResponse = {
  data: mockResponseData,
  message: 'success',
  status: 'ok',
};

describe('reset Pin API call', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await resetPin(
      mockConfig,
      resetPinRequestBody,
      deviceToken,
      authToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.resetPin}`;
    const expectedBody = resetPinRequestBody;
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
      await resetPin(
        mockConfig,
        resetPinRequestBody,
        deviceToken,
        authToken,
        mockRetryPolicy
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForResetPin,
      APITypes.RESET_PIN,
      errorCode,
      { code: 1 }
    );
  });
});
