// Copyright 2021 Prescryptive Health, Inc.

import { ISendEventRequestBody } from '../../../models/api-request-body/send-event.request-body';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { sendNotificationEvent } from './api-v1.send-notification-event';
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
    version: 'v1',
    url: '/api',
  },
  paths: {
    eventNotifications: '/event/notifications',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const sendNotificationEventRequestBody: ISendEventRequestBody = {
  idType: 'smartContractId',
  id: 'prescription-id',
  tags: ['dRx', 'supportDashboard', 'myPrescryptive', 'prescriberFeedbackLoop'],
  subject: 'Patient viewed NewRx in Medicine Cabinet.',
  messageData: '',
};

const authToken = 'auth-token';
const deviceToken = 'device-token';

describe('send notification event API call', () => {
  beforeEach(() => {
    mockCall.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      ok: true,
    });

    await sendNotificationEvent(
      mockConfig,
      sendNotificationEventRequestBody,
      deviceToken,
      authToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.eventNotifications}`;
    const expectedBody = sendNotificationEventRequestBody;
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
