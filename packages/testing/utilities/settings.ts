// Copyright 2022 Prescryptive Health, Inc.

import dotenv from 'dotenv';
dotenv.config();

export const DATABASE_CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ?? 'Missing Connection String';
export const DATABASE_NAME =
  process.env.DATABASE_NAME ?? 'Missing Database Name';
export const BENEFIT_DATABASE_NAME =
  process.env.BENEFIT_DATABASE_NAME ?? 'Missing Benefit Database Name';
export const MYRX_REDIS_PORT = Number.parseInt(
  process.env.MYRX_REDIS_PORT ?? '6380'
);
export const MYRX_REDIS_HOST =
  process.env.MYRX_REDIS_HOST ?? 'Missing Redis Host';
export const MYRX_REDIS_ACCESS_KEY =
  process.env.MYRX_REDIS_ACCESS_KEY ?? 'Missing Redis Authorization Password';
export const AUTH0_API_CLIENT_ID =
  process.env.AUTH0_API_CLIENT_ID ?? 'Missing Auth0 Api Client ID';
export const AUTH0_API_CLIENT_SECRET =
  process.env.AUTH0_API_CLIENT_SECRET ?? 'Missing Auth0 Api Client Secret';
export const AUTH0_TOKEN_API =
  process.env.AUTH0_TOKEN_API ?? 'Missing Auth0 Token Api';
export const AUTH0_AUDIENCE_IDENTITY =
  process.env.AUTH0_AUDIENCE_IDENTITY ?? 'Missing Auth0 Audience Identity';
export const PLATFORM_GEARS_API_URL =
  process.env.PLATFORM_GEARS_API_URL ?? 'Missing Platfrom Gears Api Url';
export const GEARS_API_SUBSCRIPTION_KEY =
  process.env.GEARS_API_SUBSCRIPTION_KEY ?? 'Missing Api Subscription Key';

export const TEST_SETTINGS = {
  /**
   * Settings for twilio test sub account
   */
  getTwilio: () => ({
    TESTING_ACCOUNT_SID:
      process.env.TWILIO_ACCOUNT_SID ?? 'Missing Twilio Account',
    TESTING_ACCOUNT_TOKEN:
      process.env.TWILIO_AUTH_TOKEN ?? 'Missing Twilio Auth Token',
    TESTING_ACCOUNT_PHONE_NUMBER: '4252875333',
  }),
};
