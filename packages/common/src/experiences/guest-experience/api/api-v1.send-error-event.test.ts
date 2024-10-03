// Copyright 2023 Prescryptive Health, Inc.

import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { sendErrorEvent } from './api-v1.send-error-event';
import { ISendEventRequestBody } from '../../../models/api-request-body/send-event.request-body';
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

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    url: '/api/v1',
    version: 'v1',
  },
  paths: {
    eventErrors: '/event/errors',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const sendErrorEventRequestBody: ISendEventRequestBody = {
  idType: 'smartContractId',
  id: 'prescription-id',
  tags: ['dRx', 'supportDashboard'],
  type: 'error',
  subject: 'send - error',
  messageData: '',
};

const authToken = 'auth-token';
const deviceToken = 'device-token';

describe('send error event API call', () => {
  beforeEach(() => {
    mockCall.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      ok: true,
    });

    await sendErrorEvent(
      mockConfig,
      sendErrorEventRequestBody,
      deviceToken,
      authToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.eventErrors}`;
    const expectedBody = sendErrorEventRequestBody;
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
