// Copyright 2022 Prescryptive Health, Inc.

import fetch, { Headers } from 'node-fetch';
import { StringFormatter } from '../../utils/string.formatter.js';

export async function generateIdentityBearerToken(
  clientId,
  clientSecret,
  audience
) {
  const parameterMapBody = new Map([
    ['clientId', clientId],
    ['clientSecret', clientSecret],
    ['audience', audience],
  ]);

  const url = process.env.IDENTITY_TOKEN_URL;
  const body = StringFormatter.format(
    process.env.IDENTITY_OAUTH_API_BODY,
    parameterMapBody
  );
  const apiResponse = await fetch(url, {
    body,
    headers: new Headers({
      ['Content-Type']: 'application/x-www-form-urlencoded',
      ['Accept']: '*/*',
    }),
    method: 'POST',
  });
  if (apiResponse.ok) {
    const tokenResponse = await apiResponse.json();
    return tokenResponse.access_token;
  }
  const tokenError = await apiResponse.json();
  throw new Error(`${tokenError.error} ${tokenError.error_description}`);
}
