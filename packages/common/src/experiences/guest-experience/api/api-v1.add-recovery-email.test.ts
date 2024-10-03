// Copyright 2021 Prescryptive Health, Inc.

import { IAddRecoveryEmailRequestBody } from '../../../models/api-request-body/add-recovery-email.request-body';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { RequestHeaders } from './api-request-headers';
import { handleHttpErrors } from './api-v1-helper';
import { addRecoveryEmail } from './api-v1.add-recovery-email';

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
    addRecoveryEmail: '/account/email/add',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const addRecoveryEmailRequestBody = {
  email: 'test@test.com',
} as IAddRecoveryEmailRequestBody;

const mockResponse = {
  message: 'all good',
  status: 'success',
};

describe('add recovery email', () => {
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
    await addRecoveryEmail(
      mockConfig,
      addRecoveryEmailRequestBody,
      deviceToken,
      authToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.addRecoveryEmail}`;
    const expectedBody = addRecoveryEmailRequestBody;
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
});
