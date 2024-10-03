// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { Auth0Audience } from '../../auth0/auth0.helper';
import {
  addKeyInRedis,
  getValueFromRedis,
  RedisKeys,
} from '../../utils/redis/redis.helper';
import {
  addAuth0TokenToRedis,
  getAuth0TokenFromRedis,
} from './redis-auth0.helper';

jest.mock('../../utils/redis/redis.helper');
const addKeyInRedisMock = addKeyInRedis as jest.Mock;
const getValueFromRedisMock = getValueFromRedis as jest.Mock;

describe('redisAuth0Helper', () => {
  const identityAudience: Auth0Audience = 'identity';
  const accumulatorsAudience: Auth0Audience = 'accumulators';
  const claimsAudience: Auth0Audience = 'claims';

  beforeEach(() => {
    jest.clearAllMocks();
    addKeyInRedisMock.mockResolvedValue(undefined);
    getValueFromRedisMock.mockResolvedValue(undefined);
  });

  describe('addAuth0TokenToRedis', () => {
    it.each([[identityAudience], [accumulatorsAudience], [claimsAudience]])(
      'adds key for token in Redis for audience %p',
      async (audienceMock: Auth0Audience) => {
        const addResultMock = true;
        addKeyInRedisMock.mockResolvedValue(addResultMock);

        const tokenMock = 'token';
        const expirySecondsMock = 72000;

        const result = await addAuth0TokenToRedis(
          audienceMock,
          tokenMock,
          expirySecondsMock
        );

        expectToHaveBeenCalledOnceOnlyWith(
          addKeyInRedisMock,
          audienceMock,
          tokenMock,
          expirySecondsMock,
          RedisKeys.AUTH0_KEY
        );
        expect(result).toEqual(addResultMock);
      }
    );
  });

  describe('getAuth0TokenFromRedis', () => {
    it.each([[identityAudience], [accumulatorsAudience], [claimsAudience]])(
      'gets token from Redis for audience %p',
      async (audienceMock: Auth0Audience) => {
        const tokenMock = 'token';
        getValueFromRedisMock.mockResolvedValue(tokenMock);

        const result = await getAuth0TokenFromRedis(audienceMock);

        expectToHaveBeenCalledOnceOnlyWith(
          getValueFromRedisMock,
          audienceMock,
          RedisKeys.AUTH0_KEY
        );
        expect(result).toEqual(tokenMock);
      }
    );
  });
});
