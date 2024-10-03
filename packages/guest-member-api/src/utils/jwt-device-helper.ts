// Copyright 2018 Prescryptive Health, Inc.

import { sign, TokenExpiredError, verify } from 'jsonwebtoken';

import { decodeAscii, encodeAscii } from '@phx/common/src/utils/base-64-helper';
import { ErrorDeviceTokenInvalid } from '@phx/common/src/errors/error-device-token-invalid';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';

export interface IDeviceTokenPayload {
  device: string;
  deviceIdentifier: string;
  deviceType: string;
  deviceKey: string;
  patientAccountId?: string;
}

export function decodePayload(payload: IDeviceTokenPayload) {
  payload.device = decodeAscii(payload.device);
}

export function encodePayload(payload: IDeviceTokenPayload) {
  payload.device = encodeAscii(payload.device);
}

export const verifyJsonWebToken = (
  token: string,
  jwtTokenSecretKey: string
): IDeviceTokenPayload => {
  try {
    const payload = verify(token, jwtTokenSecretKey) as IDeviceTokenPayload;

    decodePayload(payload);

    return payload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ErrorJsonWebTokenExpired(error);
    }
    throw new ErrorDeviceTokenInvalid(error as Error);
  }
};

export const generateJsonWebToken = (
  payload: IDeviceTokenPayload,
  jwtTokenSecretKey: string,
  expiryTimeInSeconds: number
) => {
  const tokenPayload: IDeviceTokenPayload = {
    device: payload.device,
    deviceIdentifier: payload.deviceIdentifier,
    deviceKey: payload.deviceKey,
    deviceType: payload.deviceType,
    patientAccountId: payload.patientAccountId,
  };

  encodePayload(tokenPayload);

  return sign(tokenPayload, jwtTokenSecretKey, {
    expiresIn: expiryTimeInSeconds,
  });
};
