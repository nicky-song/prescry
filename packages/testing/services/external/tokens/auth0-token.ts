// Copyright 2023 Prescryptive Health, Inc.

import { MyRxRedis } from '../../../data-access';
import { getDataFromUrl } from '../../../utilities/api/get-data-from-url';
import {
  AUTH0_API_CLIENT_ID,
  AUTH0_API_CLIENT_SECRET,
  AUTH0_AUDIENCE_IDENTITY,
  AUTH0_TOKEN_API,
} from '../../../utilities/settings';

export interface IAuth0TokenResponse {
  access_token: string;
  token_type: string;
}

const keyAuth0Token = 'myrx:auth0:identity:automation';

export class Auth0Token {
  private static async addAuth0TokenToRedis(client: MyRxRedis, value: string) {
    if (value.length < 1) {
      throw new Error('No valid value');
    }
    const result = await client.set(keyAuth0Token, value);
    return result;
  }

  private static async getAuth0TokenToRedis(client: MyRxRedis) {
    const result = await client.get(keyAuth0Token);
    return result;
  }

  static async get(useCache = true) {
    const session = new MyRxRedis();
    try {
      if (useCache) {
        const cachedToken = await this.getAuth0TokenToRedis(session);
        if (cachedToken) {
          return cachedToken;
        }
      }

      const apiResponse = await getDataFromUrl(
        AUTH0_TOKEN_API,
        {
          client_id: AUTH0_API_CLIENT_ID,
          client_secret: AUTH0_API_CLIENT_SECRET,
          audience: AUTH0_AUDIENCE_IDENTITY,
          grant_type: 'client_credentials',
        },
        'POST',
        undefined,
        20000
      );

      if (apiResponse.ok) {
        const response: IAuth0TokenResponse = await apiResponse.json();
        const accessToken = `${response.token_type} ${response.access_token}`;

        await this.addAuth0TokenToRedis(session, accessToken);
        return accessToken;
      }
      throw new Error(
        `Unexpected API response: ${apiResponse.statusText} and body ${apiResponse.text}`
      );
    } catch (error) {
      throw new Error(`get Auth0 token failed with error:${error}`);
    } finally {
      await session.close();
    }
  }
}
