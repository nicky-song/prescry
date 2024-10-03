// Copyright 2018 Prescryptive Health, Inc.

import { generate, parse } from 'node-webtokens';
import { ErrorAccountTokenInvalid } from '@phx/common/src/errors/error-account-token-invalid';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import {
  IAccountTokenPayload,
  IAccountTokenPayloadV2,
} from '../models/account-token-payload';
import { UTCDate } from '@phx/common/src/utils/date-time-helper';

export const verifyAccountToken = (
  token: string,
  tokenSecretKey: string
): IAccountTokenPayload => {
  const parsedToken = parse<IAccountTokenPayload>(token);
  if (parsedToken.error) {
    throw new ErrorAccountTokenInvalid(new Error(parsedToken.error.message));
  }
  const verifiedToken = parsedToken.verify(tokenSecretKey);
  if (verifiedToken.expired) {
    throw new ErrorJsonWebTokenExpired();
  }
  if (verifiedToken.error) {
    throw new ErrorAccountTokenInvalid(new Error(verifiedToken.error.message));
  }
  return verifiedToken.payload;
};

export const generateAccountToken = (
  payload: IAccountTokenPayload | IAccountTokenPayloadV2,
  jwtTokenSecretKey: string,
  expiryTimeInSeconds: number
) => {
  payload = {
    ...payload,
    exp: UTCDate(new Date()) + expiryTimeInSeconds,
  };
  return generate('A256KW', 'A256GCM', payload, jwtTokenSecretKey);
};
