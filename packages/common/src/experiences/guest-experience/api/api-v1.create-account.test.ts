// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import {
  ICreateAccountResponse,
  ICreateAccountResponseData,
} from '../../../models/api-response/create-account.response';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { createAccount } from './api-v1.create-account';
import { ICreateAccountRequestBody } from '../../../models/api-request-body/create-account.request-body';
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
    createBooking: '/account/create',
  },
};

const requestBody: ICreateAccountRequestBody = {
  firstName: 'Johnny',
  lastName: 'AppleSeed',
  email: 'test@test.com',
  dateOfBirth: 'January-01-2010',
  phoneNumber: '1234567890',
  code: '1234',
};
const mockResponseData: ICreateAccountResponseData = {
  deviceToken: 'token',
  recoveryEmailExists: true,
};

const mockResponse: ICreateAccountResponse = {
  data: mockResponseData,
  message: 'all good',
  status: 'ok',
};

describe('createAccount', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await createAccount(mockConfig, requestBody);

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.createAccount}`;
    const expectedBody = requestBody;
    const expectedHeaders = {
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders
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
      await createAccount(mockConfig, requestBody);
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

    const response = await createAccount(mockConfig, requestBody);
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
      await createAccount(mockConfig, requestBody);
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForCreateAccount,
      APITypes.CREATE_ACCOUNT,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});
