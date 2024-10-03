// Copyright 2022 Prescryptive Health, Inc.

import { IAuth0Config } from '../configuration';
import { ApiConstants } from '../constants/api-constants';
import {
  addAuth0TokenToRedis,
  getAuth0TokenFromRedis,
} from '../databases/redis/redis-auth0.helper';
import { EndpointError } from '../errors/endpoint.error';
import { defaultRetryPolicy } from '../utils/fetch-retry.helper';
import { getDataFromUrl } from '../utils/get-data-from-url';
import * as jwt from 'jsonwebtoken';

export type Auth0Audience = 'accumulators' | 'claims' | 'identity';

export interface IDecodedJwt {
  exp: number;
  iat: number;
}

export interface IAuth0TokenResponse {
  access_token: string;
  token_type: string;
}

export const getAuth0Token = async (
  audience: Auth0Audience,
  auth0Config: IAuth0Config,
  useCache = true
): Promise<string> => {
  const { clientId, clientSecret, tokenApi } = auth0Config;
  const audienceKey = getAudienceKey(audience, auth0Config);

  if (useCache) {
    const cachedToken = await getAuth0TokenFromRedis(audience);
    if (cachedToken) {
      return cachedToken;
    }
  }

  const apiResponse = await getDataFromUrl(
    tokenApi,
    {
      client_id: clientId,
      client_secret: clientSecret,
      audience: audienceKey,
      grant_type: 'client_credentials',
    },
    'POST',
    undefined,
    false,
    ApiConstants.DEFAULT_API_TIMEOUT,
    defaultRetryPolicy
  );

  if (apiResponse.ok) {
    const response: IAuth0TokenResponse = await apiResponse.json();

    const accessToken = `${response.token_type} ${response.access_token}`;

    const { exp: expiresAtSeconds, iat: issuedAtSeconds } = jwt.decode(
      response.access_token
    ) as IDecodedJwt;
    await addAuth0TokenToRedis(
      audience,
      accessToken,
      expiresAtSeconds - issuedAtSeconds
    );
    return accessToken;
  }

  throw new EndpointError(apiResponse.status, apiResponse.statusText);
};

const getAudienceKey = (
  audience: Auth0Audience,
  config: IAuth0Config
): string => {
  const audienceMap: Map<Auth0Audience, string> = new Map([
    ['accumulators', config.audienceAccumulators],
    ['claims', config.audienceClaims],
    ['identity', config.audienceIdentity],
  ]);

  return audienceMap.get(audience) ?? '';
};
