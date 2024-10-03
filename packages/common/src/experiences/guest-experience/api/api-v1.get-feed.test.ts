// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import { IFeedResponse } from '../../../models/api-response/feed-response';
import { IFeedItem } from '../../../models/api-response/feed-response';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { getFeed } from './api-v1.get-feed';
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
    feed: '/feed',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const mockFeedItems: IFeedItem[] = [
  {
    feedCode: 'feedItemCode1',
  },
  {
    feedCode: 'feedItemCode2',
  },
  {
    feedCode: 'feedItemCode3',
  },
];

const mockFeedResponse: IFeedResponse = {
  data: {
    feedItems: mockFeedItems,
  },
  message: '',
  status: 'success',
};

describe('feed', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockFeedResponse,
      ok: true,
    });

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    await getFeed(mockConfig, authToken, mockRetryPolicy, deviceToken);

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.feed}`;
    const expectedBody = undefined;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'GET',
      expectedHeaders,
      mockRetryPolicy
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
      await getFeed(mockConfig, 'auth-token', mockRetryPolicy, 'device-token');
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }
  });

  it('returns expected response', async () => {
    mockCall.mockResolvedValue({
      json: () => mockFeedResponse,
      ok: true,
    });

    const response = await getFeed(
      mockConfig,
      'auth-token',
      mockRetryPolicy,
      'device-token'
    );
    expect(response).toEqual(mockFeedResponse);
  });

  it('includes refresh token in response', async () => {
    const refreshToken = 'refresh-token';
    const headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);

    mockCall.mockResolvedValue({
      json: () => mockFeedResponse,
      ok: true,
      headers,
    });

    const response = await getFeed(
      mockConfig,
      'auth-token',
      mockRetryPolicy,
      'device-token'
    );

    expect(response.refreshToken).toEqual(refreshToken);
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
      await getFeed(mockConfig, 'auth-token', mockRetryPolicy, 'device-token');
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForGettingFeed,
      APITypes.FEED,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});
