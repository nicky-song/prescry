// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { decode } from 'jsonwebtoken';
import { IAuth0Config } from '../configuration';
import { ApiConstants } from '../constants/api-constants';
import { HttpStatusCodes } from '../constants/error-codes';
import {
  addAuth0TokenToRedis,
  getAuth0TokenFromRedis,
} from '../databases/redis/redis-auth0.helper';
import { EndpointError } from '../errors/endpoint.error';
import { defaultRetryPolicy } from '../utils/fetch-retry.helper';
import { getDataFromUrl } from '../utils/get-data-from-url';
import {
  Auth0Audience,
  getAuth0Token,
  IAuth0TokenResponse,
  IDecodedJwt,
} from './auth0.helper';

jest.mock('../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

jest.mock('../databases/redis/redis-auth0.helper');
const getAuth0TokenFromRedisMock = getAuth0TokenFromRedis as jest.Mock;
const addAuth0TokenToRedisMock = addAuth0TokenToRedis as jest.Mock;

jest.mock('jsonwebtoken');
const decodeMock = decode as jest.Mock;

describe('Auth0Helper', () => {
  const auth0ConfigMock: IAuth0Config = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    tokenApi: 'token-api',
    audienceAccumulators: 'audience-accumulators',
    audienceClaims: 'audience-claims',
    audienceIdentity: 'audience-identity',
  };

  const accumulatorsAudience: Auth0Audience = 'accumulators';
  const identityAudience: Auth0Audience = 'identity';

  const tokenResponseMock: IAuth0TokenResponse = {
    access_token: 'access-token',
    token_type: 'token-type',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getDataFromUrlMock.mockReturnValue({});
    getAuth0TokenFromRedisMock.mockResolvedValue(undefined);
    addAuth0TokenToRedisMock.mockResolvedValue(undefined);
    decodeMock.mockReturnValue({});
  });

  it.each([
    [undefined, accumulatorsAudience],
    [false, accumulatorsAudience],
    [true, identityAudience],
  ])(
    'gets Auth0 token from cache if requested (useCache: %p; audience: %p)',
    async (useCacheMock: boolean | undefined, audienceMock: Auth0Audience) => {
      const cachedTokenMock = 'cached-token';
      getAuth0TokenFromRedisMock.mockResolvedValue(cachedTokenMock);

      const responseMock: Partial<Response> = {
        ok: true,
        json: jest.fn().mockResolvedValue(tokenResponseMock),
      };
      getDataFromUrlMock.mockResolvedValue(responseMock);

      const token = await getAuth0Token(
        audienceMock,
        auth0ConfigMock,
        useCacheMock
      );

      if (useCacheMock === false) {
        expect(getAuth0TokenFromRedisMock).not.toHaveBeenCalled();
        expect(getDataFromUrlMock).toHaveBeenCalled();
      } else {
        expectToHaveBeenCalledOnceOnlyWith(
          getAuth0TokenFromRedisMock,
          audienceMock
        );
        expect(token).toEqual(cachedTokenMock);

        expect(getDataFromUrlMock).not.toHaveBeenCalled();
      }
    }
  );

  it('requests token from endpoint if cache requested but no token is cached', async () => {
    const cachedTokenMock = undefined;
    getAuth0TokenFromRedisMock.mockResolvedValue(cachedTokenMock);

    const responseMock: Partial<Response> = {
      ok: true,
      json: jest.fn().mockResolvedValue(tokenResponseMock),
    };
    getDataFromUrlMock.mockResolvedValue(responseMock);

    const audienceMock: Auth0Audience = 'claims';
    await getAuth0Token(audienceMock, auth0ConfigMock, true);

    expectToHaveBeenCalledOnceOnlyWith(
      getAuth0TokenFromRedisMock,
      audienceMock
    );
    expect(getDataFromUrlMock).toHaveBeenCalled();
  });

  it.each([
    ['accumulators', auth0ConfigMock.audienceAccumulators],
    ['claims', auth0ConfigMock.audienceClaims],
    ['identity', auth0ConfigMock.audienceIdentity],
  ])(
    'gets Auth0 token for audience %p',
    async (audienceMock: string, expectedAudienceKey: string) => {
      const responseMock: Partial<Response> = {
        ok: true,
        json: jest.fn().mockResolvedValue(tokenResponseMock),
      };
      getDataFromUrlMock.mockResolvedValue(responseMock);

      const decodedTokenMock: IDecodedJwt = {
        exp: 72000,
        iat: 0,
      };
      decodeMock.mockReturnValue(decodedTokenMock);

      const token = await getAuth0Token(
        audienceMock as Auth0Audience,
        auth0ConfigMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        getDataFromUrlMock,
        auth0ConfigMock.tokenApi,
        {
          client_id: auth0ConfigMock.clientId,
          client_secret: auth0ConfigMock.clientSecret,
          audience: expectedAudienceKey,
          grant_type: 'client_credentials',
        },
        'POST',
        undefined,
        false,
        ApiConstants.DEFAULT_API_TIMEOUT,
        defaultRetryPolicy
      );

      expectToHaveBeenCalledOnceOnlyWith(
        decodeMock,
        tokenResponseMock.access_token
      );

      const expectedToken = `${tokenResponseMock.token_type} ${tokenResponseMock.access_token}`;
      const expectedExpiresAt = decodedTokenMock.exp - decodedTokenMock.iat;

      expectToHaveBeenCalledOnceOnlyWith(
        addAuth0TokenToRedisMock,
        audienceMock,
        expectedToken,
        expectedExpiresAt
      );
      expect(token).toEqual(
        `${tokenResponseMock.token_type} ${tokenResponseMock.access_token}`
      );
    }
  );

  it('throws exception if token request fails', async () => {
    const statusTextMock = 'error';
    const statusCodeMock = HttpStatusCodes.BAD_REQUEST;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusCodeMock,
      statusText: statusTextMock,
    };
    getDataFromUrlMock.mockResolvedValue(responseMock);

    try {
      await getAuth0Token('accumulators', auth0ConfigMock);
      fail('Exception expected but none thrown');
    } catch (ex) {
      expect(ex).toEqual(
        new EndpointError(statusCodeMock, responseMock.statusText)
      );
    }
  });
});
