// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import { ISendVerificationCodeRequestBody } from '../../../models/api-request-body/send-verification-code.request-body';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { RequestHeaders } from './api-request-headers';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { sendVerificationCode } from './api-v1.send-verification-code';

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
    sendVerificationCode: 'sendVerificationCode',
  },
};

const mockResponse = {
  message: 'message',
  status: 'success',
};

describe('sendVerificationCode', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  const expectedBody = {
    verificationType: 'PHONE',
  };
  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const authToken = 'auth-token';
    const deviceToken = 'device-token';

    await sendVerificationCode(
      mockConfig,
      {
        verificationType: 'PHONE',
      } as ISendVerificationCodeRequestBody,
      deviceToken,
      authToken
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.sendVerificationCode}`;

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
      undefined
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
      await sendVerificationCode(mockConfig, {
        verificationType: 'PHONE',
      } as ISendVerificationCodeRequestBody);
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

    const response = await sendVerificationCode(mockConfig, {
      verificationType: 'PHONE',
    } as ISendVerificationCodeRequestBody);
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
      await sendVerificationCode(mockConfig, {
        verificationType: 'PHONE',
      } as ISendVerificationCodeRequestBody);
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForSendVerificationCode,
      APITypes.SEND_VERIFICATION_CODE,
      errorCode,
      { code: 1 }
    );
  });
});
