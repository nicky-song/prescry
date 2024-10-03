// Copyright 2022 Prescryptive Health, Inc.

import type { Jwt, JwtHeader, JwtPayload } from 'jsonwebtoken';

export interface SsoTokenHeader extends JwtHeader {
  alg: string;
  typ: string;
  kid: string;
}

const SSO_TOKEN_HEADER_KEYS: Record<keyof SsoTokenPayload, string> = {
  alg: 'string',
  typ: 'string',
  kid: 'string',
};

export interface SsoTokenPayload extends JwtPayload {
  exp: number;
  first_name: string;
  last_name: string;
  birthdate: string;
  member_id: string;
  phone_number: string;
  partner_id: string;
  group_number: string;
  member_plan_id: string;
  email: string;
  phone_number_verified?: boolean;
  email_verified?: boolean;
  preferred_language?: boolean;
}

const REQUIRED_SSO_TOKEN_PAYLOAD_KEYS: Record<keyof SsoTokenPayload, string> = {
  exp: 'number',
  first_name: 'string',
  last_name: 'string',
  birthdate: 'string',
  member_id: 'string',
  phone_number: 'string',
  partner_id: 'string',
  group_number: 'string',
  member_plan_id: 'string',
  email: 'email',
};

export interface SsoToken extends Jwt {
  header: SsoTokenHeader;
  payload: SsoTokenPayload;
}

// eslint-disable-next-line
export function isSsoTokenPayload(obj?: any): obj is SsoTokenPayload {
  return (
    !!obj &&
    Object.keys(REQUIRED_SSO_TOKEN_PAYLOAD_KEYS)
      .filter((key) => obj[key] === undefined)
      .map((key) => key as keyof SsoTokenPayload).length === 0
  );
}

// eslint-disable-next-line
export function isSsoTokenHeader(obj?: any): obj is SsoTokenHeader {
  return (
    !!obj &&
    Object.keys(SSO_TOKEN_HEADER_KEYS)
      .filter((key) => obj[key] === undefined)
      .map((key) => key as keyof SsoTokenHeader).length === 0
  );
}

// eslint-disable-next-line
export function isSsoToken(obj?: any): obj is SsoToken {
  return (
    !!obj && isSsoTokenHeader(obj?.header) && isSsoTokenPayload(obj?.payload)
  );
}
