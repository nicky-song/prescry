// Copyright 2022 Prescryptive Health, Inc.

import { JwksClient } from 'jwks-rsa';
import { decode, verify } from 'jsonwebtoken';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { ErrorPartnerTokenInvalid } from '@phx/common/src/errors/error-partner-token-invalid';

import { jwksClientMock } from '../mock-data/jwks-client-mock';

const environment = process.env.ENVIRONMENT || 'test';
export class JwksManager {
  private static instance: JwksManager;
  private static clientInstances = new Map<string, JwksClient>();

  private constructor() {
    if (!JwksManager.instance) {
      if (environment === 'test') {
        JwksManager.clientInstances.set(
          jwksClientMock.clientKey,
          jwksClientMock.client
        );
      }

      JwksManager.instance = this;
    }
  }

  public updateClientInstances(endPoints: Map<string, string>) {
    for (const [key, val] of endPoints) {
      const client = new JwksClient({
        jwksUri: val,
        cache: true,
        cacheMaxAge: 900000,
        rateLimit: true,
        jwksRequestsPerMinute: 8,
        timeout: 12000,
      });

      JwksManager.clientInstances.set(key, client);
    }
  }

  public getJwksClient(key: string) {
    return JwksManager.clientInstances.get(key);
  }

  public async getSigningKey(clientId: string, kid?: string) {
    try {
      const client = this.getJwksClient(clientId);
      if (!client) {
        throw new Error(`Unable to find jwks client for: ${clientId}`);
      }
      const signingKey = await client.getSigningKey(kid);
      return signingKey.getPublicKey();
    } catch (error) {
      //TODO: TASK 43980  - We were unable to get the key. Telemetry should be captured

      // eslint-disable-next-line
      throw new ErrorPartnerTokenInvalid(error as Error);
    }
  }

  public async verifyExternalJwt(clientKey: string, token: string) {
    const unverifiedToken = decode(token, { complete: true });

    try {
      const key = await this.getSigningKey(
        clientKey,
        unverifiedToken?.header?.kid
      );

      return verify(token, key) as JwtPayload;
    } catch (error) {
      //TODO: TASK 43980 - We were unable to verify token - Telemetry should be captured

      if (error instanceof TokenExpiredError) {
        throw new ErrorJsonWebTokenExpired(error);
      }

      throw new ErrorPartnerTokenInvalid(error as Error);
    }
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new JwksManager();
    }
    return this.instance;
  }
}
