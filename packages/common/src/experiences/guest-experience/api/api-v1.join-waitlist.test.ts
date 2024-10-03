// Copyright 2021 Prescryptive Health, Inc.

import { ICreateWaitlistRequestBody } from '../../../models/api-request-body/create-waitlist.request-body';
import { ICreateWaitlistResponse } from '../../../models/api-response/create-waitlist.response';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { RequestHeaders } from './api-request-headers';
import { handleHttpErrors } from './api-v1-helper';
import { joinWaitlist } from './api-v1.join-waitlist';

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
    joinWaitlist: '/waitlist',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const joinWaitlistRequestBody = {
  serviceType: 'service-type',
  zipCode: '12345',
  maxMilesAway: 10,
  myself: true,
} as ICreateWaitlistRequestBody;

const mockResponseData = {
  identifier: '123453',
  phoneNumber: '+16045582739',
  serviceType: 'service-type',
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: '2000-01-01',
  zipCode: '78885',
  maxMilesAway: 10,
  serviceName: 'mock-service',
};

const mockResponse: ICreateWaitlistResponse = {
  data: mockResponseData,
  message: 'all good',
  status: 'ok',
};

describe('create waitlist entry', () => {
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
    await joinWaitlist(
      mockConfig,
      joinWaitlistRequestBody,
      deviceToken,
      authToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.joinWaitlist}`;
    const expectedBody = joinWaitlistRequestBody;
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
