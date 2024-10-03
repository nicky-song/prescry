// Copyright 2020 Prescryptive Health, Inc.

import fetch, { Headers, Response } from 'node-fetch';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { ApiConstants } from '../../../constants/api-constants';

export interface IBearerTokenResponse {
  token_type: string;
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
}
export interface IBearerTokenErrorResponse {
  error: string;
  error_description: string;
}
export async function generateBearerToken(
  tenantId: string,
  clientId: string,
  clientSecret: string,
  scope: string,
  isResourceUrl = false
): Promise<string> {
  const parameterMapUrl = new Map<string, string>([['tenantId', tenantId]]);
  const parameterMapBody = new Map<string, string>([
    ['clientId', clientId],
    ['clientSecret', clientSecret],
    ['scope', scope],
  ]);
  const url = StringFormatter.format(
    isResourceUrl ? ApiConstants.RESOURCE_TOKEN_URL : ApiConstants.EXCHANGE_URL,
    parameterMapUrl
  );

  const body = StringFormatter.format(
    isResourceUrl
      ? ApiConstants.OAUTH_API_BODY_RESOURCE
      : ApiConstants.OAUTH_API_BODY,
    parameterMapBody
  );
  const apiResponse: Response = await fetch(url, {
    body,
    headers: new Headers({
      ['Content-Type']: 'application/x-www-form-urlencoded',
      ['Accept']: '*/*',
    }),
    method: 'POST',
  });

  if (apiResponse.ok) {
    const tokenResponse: IBearerTokenResponse = await apiResponse.json();
    return tokenResponse.access_token;
  }
  const tokenError: IBearerTokenErrorResponse = await apiResponse.json();
  throw new Error(`${tokenError.error} ${tokenError.error_description}`);
}
