// Copyright 2018 Prescryptive Health, Inc.

import { generate, parse } from 'node-webtokens';
import { ErrorAccountTokenInvalid } from '@phx/common/src/errors/error-account-token-invalid';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { IJwtTokenPayload } from '../models/token-payload';

export const verifyJwtToken = (
  token: string,
  jwtTokenSecretKey: string
): IJwtTokenPayload => {
  const parsedToken = parse<IJwtTokenPayload>(token);
  if (parsedToken.error) {
    throw new ErrorAccountTokenInvalid(new Error(parsedToken.error.message));
  }
  const verifiedToken = parsedToken.verify(jwtTokenSecretKey);
  if (verifiedToken.expired) {
    throw new ErrorJsonWebTokenExpired();
  }
  if (verifiedToken.error) {
    throw new ErrorAccountTokenInvalid(new Error(verifiedToken.error.message));
  }
  return verifiedToken.payload;
};

export const generateJwtToken = (
  payload: IJwtTokenPayload,
  jwtTokenSecretKey: string,
  currentUtcTimeInSeconds: number,
  expiryTimeInSeconds: number,
  phoneNumberVerifiedFlag?: boolean
) => {
  payload = {
    ...payload,
    exp: currentUtcTimeInSeconds + expiryTimeInSeconds,
    isPhoneNumberVerified:
      phoneNumberVerifiedFlag || payload.isPhoneNumberVerified,
  };
  const token: string = generate(
    'A256KW',
    'A256GCM',
    payload,
    jwtTokenSecretKey
  );
  return token;
};
