// Copyright 2023 Prescryptive Health, Inc.

import { MyRxRedis } from '../../../data-access';
import * as jwt from 'jsonwebtoken';
import fetch, { Response } from 'node-fetch';
import moment from 'moment-timezone';
import { JwtPayload } from 'jsonwebtoken';

export abstract class PharmacyPortalTokenHandler {
  private static readonly keyOauthToken =
    'myrx:Oauth:pharmacy-portal:automation';

  private static generateNewToken = async (): Promise<string> => {
    const tenantId = process.env.PHARMACY_PORTAL_API_TENANT_ID;
    if (tenantId === undefined)
      throw new Error('Pharmacy Portal Tenant ID is not defined');

    const apiClientId = process.env.PHARMACY_PORTAL_API_CLIENT_ID;
    if (apiClientId === undefined)
      throw new Error('Pharmacy Portal Client ID is not defined');

    const apiClientSecret = process.env.PHARMACY_PORTAL_API_CLIENT_SECRET;
    if (apiClientSecret === undefined)
      throw new Error('Pharmacy Portal Client Secret is not defined');

    const apiScope = process.env.PHARMACY_PORTAL_API_SCOPE;
    if (apiScope === undefined)
      throw new Error('Pharmacy Portal Scope is not defined');

    const urlencoded = new URLSearchParams();
    urlencoded.append('client_id', apiClientId);
    urlencoded.append('client_secret', apiClientSecret);
    urlencoded.append('scope', apiScope);
    urlencoded.append('grant_type', 'client_credentials');

    const apiResponse: Response = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
        },
        body: urlencoded,
      }
    );

    const response = await apiResponse.json();

    if (apiResponse.ok) {
      const successResponse: {
        access_token: string;
      } = response;
      return successResponse.access_token;
    } else {
      if (apiResponse.status === 400 || apiResponse.status === 401) {
        const errorResponse: {
          error: string;
          error_description: string;
        } = response;

        throw new Error(
          `Pharmacy Portal Access Token acquire fail with error: ${errorResponse.error} ${errorResponse.error_description}`
        );
      }

      throw new Error(
        `Failed to get Pharmacy Portal Access Token. HTTP Error Response: ${apiResponse.status} ${apiResponse.statusText}`
      );
    }
  };

  public static getToken = async (): Promise<string> => {
    const redisApi = new MyRxRedis();
    try {
      let token = await redisApi.get(this.keyOauthToken);
      let generateNewToken = false;

      if (token) {
        const jwtPayload = jwt.decode(token) as JwtPayload;
        const epochNow = moment(moment.now());
        generateNewToken = epochNow.isAfter((jwtPayload.exp as number) * 1000);
      }

      if (!token || generateNewToken) {
        token = await this.generateNewToken();
        await redisApi.set(this.keyOauthToken, token);
      }
      return token;
    } catch (error) {
      throw new Error(`Failed to get token with error ${error}`);
    } finally {
      await redisApi.close();
    }
  };
}
