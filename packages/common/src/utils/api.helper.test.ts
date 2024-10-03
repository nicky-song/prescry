// Copyright 2018 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../errors/error-codes';
import {
  buildAuthHeaders,
  buildCommonHeaders,
  buildUrl,
  call,
  fetchRetry,
  IApiConfig,
} from './api.helper';
import {
  DefaultPolicyTemplates,
  IRetryPolicy,
} from './retry-policies/retry-policy.helper';
import { ErrorApiResponse } from '../errors/error-api-response';
import { RequestHeaders } from '../experiences/guest-experience/api/api-request-headers';

describe('buildUrl', () => {
  const defaultApiConfig: IApiConfig = {
    env: {
      host: 'Xhost',
      port: 'Xport',
      protocol: 'https',
      version: 'version',
      url: '/url'
    },
    paths: {
      pathx: '/Xpathvalue/2',
    },
    retryPolicy: {
      pause: 100,
      remaining: 3,
    },
    switches: '?f=test:1,test2&otherstuff=123',
  };

  it('should convert url from basic config', () => {
    const url = buildUrl(defaultApiConfig, 'pathx', {});

    expect(url).toEqual('https://Xhost:Xport/url/Xpathvalue/2');
  });

  it('should support http protocol', () => {
    const url = buildUrl(
      {
        ...defaultApiConfig,
        env: {
          ...defaultApiConfig.env,
          protocol: 'https',
        },
      },
      'pathx',
      {}
    );

    expect(url).toEqual('https://Xhost:Xport/url/Xpathvalue/2');
  });

  it('should url from basic config and replace args', () => {
    const url = buildUrl(
      {
        ...defaultApiConfig,
        paths: {
          pathx: '/pathxval/:argx/test:argy',
        },
      },
      'pathx',
      {
        ':argx': 'testargv',
        ':argy': 'testargy',
      }
    );

    expect(url).toEqual(
      'https://Xhost:Xport/url/pathxval/testargv/testtestargy'
    );
  });

  it('should return correct url and replace args when aditionalParams is passed', () => {
    const url = buildUrl(
      {
        ...defaultApiConfig,
        paths: {
          pathx: '/pathxval/:argx/test:argy',
        },
      },
      'pathx',
      {
        ':argx': 'testargv',
        ':argy': 'testargy',
        ':additionalargz': 'testargz',
      },
      '/:additionalargz'
    );

    expect(url).toEqual(
      'https://Xhost:Xport/url/pathxval/testargv/testtestargy/testargz'
    );
  });
});

describe('buildAuthHeaders', () => {
  it('builds expected headers', () => {
    const authToken = 'auth_token';

    expect(buildAuthHeaders(authToken)).toEqual({
      Authorization: `Bearer ${authToken}`,
    });
  });
});

describe('fetchRetry', () => {
  const endpoint = '/Xpathvalue/2';
  const options = {
    body: null,
    headers: {},
    method: 'GET',
  };

  const mockNextRetry = jest.fn().mockReturnValue({
    getNextRetry: jest.fn().mockReturnValue({
      getNextRetry: jest.fn().mockResolvedValue({
        pause: 0,
        remaining: 0,
      }),
      pause: 100,
      remaining: 1,
    }),
    pause: 100,
    remaining: 2,
  });

  const mockRetryPolicy = {
    getNextRetry: mockNextRetry,
    pause: 100,
    remaining: 3,
  } as IRetryPolicy;

  it('should always return Promise object', () => {
    const mockFetch = jest.fn().mockImplementation(() => {
      return Promise.resolve(2);
    });
    const promise = fetchRetry(endpoint, options, mockFetch, mockRetryPolicy);
    expect(promise).toBeInstanceOf(Promise);
  });

  it('should retry fetch with retry count from policy if fetch unsuccessful', async () => {
    const mockFetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({ ok: false });
    });
    const apiHelper = jest.requireActual('./api.helper.ts');
    apiHelper.pause = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });
    await fetchRetry(endpoint, options, mockFetch, mockRetryPolicy);
    expect(mockFetch).toBeCalledTimes(mockRetryPolicy.remaining);
    expect(apiHelper.pause).toBeCalledTimes(mockRetryPolicy.remaining);
    expect(mockFetch).toBeCalledWith(endpoint, options);
  });

  it('should call fetch once if fetch successful', async () => {
    const mockFetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({ ok: true });
    });
    const apiHelper = jest.requireActual('./api.helper.ts');
    apiHelper.pause = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });
    await fetchRetry(endpoint, options, mockFetch, mockRetryPolicy);

    expect(mockFetch).toBeCalledTimes(1);
    expect(apiHelper.pause).toBeCalledTimes(0);
    expect(mockFetch).toBeCalledWith(endpoint, options);
  });

  it('should call fetch at least once if retry policy is not provided', async () => {
    const mockFetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({ status: HttpStatusCodes.SERVICE_UNAVAILABLE });
    });
    const apiHelper = jest.requireActual('./api.helper.ts');
    apiHelper.pause = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });
    await fetchRetry(endpoint, options, mockFetch);

    expect(mockFetch).toBeCalledTimes(DefaultPolicyTemplates.GET.remaining + 1);
    expect(apiHelper.pause).toBeCalledTimes(
      DefaultPolicyTemplates.GET.remaining + 1
    );
    expect(mockFetch).toBeCalledWith(endpoint, options);
  });

  it('should throw ErrorApiResponse when fetch fails to return response', async () => {
    const policyWithMultipleRetries: IRetryPolicy = {
      ...mockRetryPolicy,
      remaining: 3,
    };
    await shouldThrowErrorApiResponseWhenFetchFailsToReturnResponse(
      policyWithMultipleRetries,
      policyWithMultipleRetries.remaining
    );

    const policyWithZeroRetries: IRetryPolicy = {
      ...mockRetryPolicy,
      remaining: 0,
    };
    await shouldThrowErrorApiResponseWhenFetchFailsToReturnResponse(
      policyWithZeroRetries,
      1
    );
  });

  async function shouldThrowErrorApiResponseWhenFetchFailsToReturnResponse(
    retryPolicy: IRetryPolicy,
    expectedFetchCount: number
  ) {
    const mockFetch = jest.fn().mockRejectedValue('TypeError: Failed to fetch');

    try {
      await fetchRetry(endpoint, options, mockFetch, retryPolicy);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorApiResponse);
    }
    expect(mockFetch).toHaveBeenCalledTimes(expectedFetchCount);
  }
});

describe('call', () => {
  const endpoint = '/Xpathvalue/2';
  const data = { param: '' };
  const method = 'GET';
  const header = {};
  const mockRetryPolicy = { remaining: 5, pause: 100 } as IRetryPolicy;

  it('should always return Promise object', () => {
    const promise = call(endpoint, data, method, header, mockRetryPolicy);
    expect(promise).toBeInstanceOf(Promise);
  });

  it('should call fetchRetry with url, maxRetryCount, interval and options', async () => {
    const apiHelper = jest.requireActual('./api.helper.ts');
    apiHelper.fetchRetry = jest.fn();
    await call(endpoint, data, method, header, mockRetryPolicy);

    expect(fetchRetry).toHaveBeenCalledWith(
      endpoint,
      {
        body: null,
        headers: {
          map: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
        },
        method: 'GET',
      },
      fetch,
      mockRetryPolicy
    );
  });
});

describe('buildCommonHeaders', () => {
  const deviceToken = 'device-token';
  const accountToken = 'account-token';

  it('should return object with Authorization header key if accountToken token is defined and deviceToken is undefined ', () => {
    const config = { env: {} } as IApiConfig;
    expect(buildCommonHeaders(config, accountToken)).toEqual({
      [RequestHeaders.authorization]: accountToken,
    });
  });

  it('should return object with device token header key if deviceToken token is defined and accountToken is undefined ', () => {
    const config = { env: {} } as IApiConfig;
    expect(buildCommonHeaders(config, undefined, deviceToken)).toEqual({
      [RequestHeaders.deviceTokenRequestHeader]: deviceToken,
    });
  });

  it('should return object with switches header key if switches is defined ', () => {
    const switches = 'f=1311:123,sdfasf:2&other=123';
    const config = {
      switches: `?${switches}`,
      env: {}
    } as IApiConfig;
    expect(buildCommonHeaders(config, undefined, undefined)).toEqual({
      [RequestHeaders.switches]: switches,
    });
  });

  it('should return object with both header key if deviceToken token and accountToken is defined ', () => {
    const switches = 'f=1311:123,sdfasf:2&other=123';
    const config = {
      switches: `?${switches}`,
      env: {}
    } as IApiConfig;
    expect(buildCommonHeaders(config, accountToken, deviceToken)).toEqual({
      [RequestHeaders.authorization]: accountToken,
      [RequestHeaders.deviceTokenRequestHeader]: deviceToken,
      [RequestHeaders.switches]: switches,
    });
  });

  it('should return empty object if all tokens are undefined ', () => {
    const config = { env: {} } as IApiConfig;
    expect(buildCommonHeaders(config)).toEqual({});
  });

  it('should return header if env version is set', () => {
    const version = 'v1';

    const config = {
      env: {
        version
      }
    } as IApiConfig;

    expect(buildCommonHeaders(config)).toEqual({
      [RequestHeaders.apiVersion]: version
    });
  });
});
