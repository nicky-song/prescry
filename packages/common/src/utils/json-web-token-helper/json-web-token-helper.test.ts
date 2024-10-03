// Copyright 2018 Prescryptive Health, Inc.

import { decode } from 'jsonwebtoken';
import { decodeAscii } from '../base-64-helper';
import { generateSHA256Hash } from '../crypto.helper';
import {
  decodeJsonWebToken,
  generatePinHash,
  getPhoneNumberFromDeviceToken,
} from './json-web-token-helper';

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn(),
}));

jest.mock('../crypto.helper', () => ({
  generateSHA256Hash: jest.fn(),
}));

jest.mock('../base-64-helper');

const decodeMock = decode as jest.Mock;
const generateSHA256HashMock = generateSHA256Hash as jest.Mock;
const decodeAsciiMock = decodeAscii as jest.Mock;
const mockToken = 'mock-token';
const mockPin = '1234';
beforeEach(() => {
  decodeMock.mockReset();
  decodeMock.mockReturnValue({ deviceKey: 'device-key', device: 'device' });
  generateSHA256HashMock.mockReset();
  generateSHA256HashMock.mockReturnValue(
    'LgqGpmCj9A8wn34LUjYoWqxY+yu7hjympFWEfZt1X4Q='
  );
  decodeAsciiMock.mockReset();
  decodeAsciiMock.mockReturnValueOnce('phonenumber');
});

describe('decodeJsonWebToken', () => {
  it('should call decode with token and return decoded token', () => {
    expect(decodeJsonWebToken(mockToken)).toEqual({
      deviceKey: 'device-key',
      device: 'device',
    });
    expect(decodeMock).toHaveBeenCalledWith(mockToken);
  });
});

describe('generatePinHash', () => {
  it('should call decode with token and return decoded token', () => {
    expect(generatePinHash(mockPin, mockToken)).toBe(
      'LgqGpmCj9A8wn34LUjYoWqxY+yu7hjympFWEfZt1X4Q='
    );
    expect(generateSHA256HashMock).toHaveBeenCalledWith('1234device-key');
  });
});

describe('getPhoneNumberFromDeviceToken', () => {
  it('should call decodeJsonWebToken with token and return device number', () => {
    expect(getPhoneNumberFromDeviceToken(mockToken)).toBe('phonenumber');
    expect(decodeAsciiMock).toHaveBeenCalledWith('device');
  });
});
