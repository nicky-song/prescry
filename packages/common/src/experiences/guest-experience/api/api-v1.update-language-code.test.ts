// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { IUpdateLanguageCodeRequestBody } from '../../../models/api-request-body/update-language-code.request-body';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { RequestHeaders } from './api-request-headers';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { updateLanguageCode } from './api-v1.update-language-code';

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
    languageCode: '/account/language-code',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const languageCodeMock = 'en';

const updateLanguageCodeRequestBody = {
  languageCode: languageCodeMock,
} as IUpdateLanguageCodeRequestBody;

const mockResponse = {
  message: 'all good',
  status: 'success',
};

describe('update language-code', () => {
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
    await updateLanguageCode(
      mockConfig,
      updateLanguageCodeRequestBody,
      deviceToken,
      authToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.languageCode}`;
    const expectedBody = updateLanguageCodeRequestBody;
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

    expect(mockHandleHttpErrors).not.toHaveBeenCalled();
  });

  it('throws handleHttpErrors on error', async () => {
    const errorCodeMock = 1;
    const statusCodeMock = HttpStatusCodes.NOT_FOUND;
    const errorResponseMock = {
      json: () => ({
        code: errorCodeMock,
      }),
      ok: false,
      status: statusCodeMock,
    };

    mockCall.mockResolvedValue(errorResponseMock);

    const authToken = 'auth-token';
    const deviceToken = 'device-token';

    try {
      await updateLanguageCode(
        mockConfig,
        updateLanguageCodeRequestBody,
        deviceToken,
        authToken,
        mockRetryPolicy
      );
    } catch (error) {
      expect(mockHandleHttpErrors).toHaveBeenCalledTimes(1);
      expect(mockHandleHttpErrors).toHaveBeenNthCalledWith(
        1,
        statusCodeMock,
        ErrorConstants.errorForUpdateLanguageCode,
        APITypes.UPDATE_LANGUAGE_CODE,
        errorCodeMock,
        { code: errorCodeMock }
      );
    }
  });
});
