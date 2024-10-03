// Copyright 2020 Prescryptive Health, Inc.

import { logExternalApiRequestBody } from './custom-event-helper';
import { getDataFromUrl, RequestMethod } from './get-data-from-url';
import { fetchRetry } from './fetch-retry.helper';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('./fetch-retry.helper');
const fetchRetryMock = fetchRetry as jest.Mock;

jest.mock('./custom-event-helper');
const logExternalApiRequestBodyMock = logExternalApiRequestBody as jest.Mock;

describe('getDataFromUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls fetch retry', async () => {
    const endpointMock = 'endpoint';
    const methodMock: RequestMethod = 'POST';
    const bodyMock = {};

    await getDataFromUrl(endpointMock, bodyMock, methodMock);

    const expectedBody = JSON.stringify(bodyMock);
    expectToHaveBeenCalledOnceOnlyWith(
      fetchRetryMock,
      endpointMock,
      {
        body: expectedBody,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: methodMock,
        timeout: undefined,
      },
      undefined
    );
    expectToHaveBeenCalledOnceOnlyWith(
      logExternalApiRequestBodyMock,
      endpointMock,
      expectedBody
    );
  });

  it('calls fetch with timeout parameter', async () => {
    const timeoutMock = 20000;
    const endpointMock = 'endpoint';
    const methodMock: RequestMethod = 'POST';
    const bodyMock = {};

    await getDataFromUrl(
      endpointMock,
      bodyMock,
      methodMock,
      undefined,
      undefined,
      timeoutMock
    );

    const expectedBody = JSON.stringify(bodyMock);

    expectToHaveBeenCalledOnceOnlyWith(
      fetchRetryMock,
      endpointMock,
      {
        body: expectedBody,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: methodMock,
        timeout: timeoutMock,
      },
      undefined
    );
    expectToHaveBeenCalledOnceOnlyWith(
      logExternalApiRequestBodyMock,
      endpointMock,
      expectedBody
    );
  });

  it('should not call logExternalApiRequestBody if request is GET', async () => {
    await getDataFromUrl('endpoint', undefined, 'GET');

    expect(logExternalApiRequestBodyMock).not.toHaveBeenCalled();
  });
});
