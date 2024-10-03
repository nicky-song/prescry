// Copyright 2018 Prescryptive Health, Inc.

import { decode } from 'jsonwebtoken';
import { decodeAscii } from '../base-64-helper';
import { generateSHA256Hash } from '../crypto.helper';

export interface ITokenPayload {
  deviceKey: string;
  device: string;
}

export const decodeJsonWebToken = <T>(token: string) => decode(token) as T;

export const generatePinHash = (pin: string, deviceToken: string) => {
  const decodedToken = decodeJsonWebToken(deviceToken) as ITokenPayload;
  return generateSHA256Hash(pin + decodedToken.deviceKey);
};

export const getPhoneNumberFromDeviceToken = (deviceToken: string) => {
  const decodedToken = decodeJsonWebToken(deviceToken) as ITokenPayload;
  return decodeAscii(decodedToken.device);
};
