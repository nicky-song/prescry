// Copyright 2022 Prescryptive Health, Inc.

import { Auth0Audience } from '../../auth0/auth0.helper';
import {
  addKeyInRedis,
  getValueFromRedis,
  RedisKeys,
} from '../../utils/redis/redis.helper';

export const addAuth0TokenToRedis = (
  audience: Auth0Audience,
  token: string,
  expiryInSeconds: number
) => addKeyInRedis(audience, token, expiryInSeconds, RedisKeys.AUTH0_KEY);

export const getAuth0TokenFromRedis = (audience: Auth0Audience) =>
  getValueFromRedis<string | undefined>(audience, RedisKeys.AUTH0_KEY);
