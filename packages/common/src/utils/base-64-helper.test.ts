// Copyright 2018 Prescryptive Health, Inc.

import { decodeAscii, encodeAscii } from './base-64-helper';

describe('encodeAscii', () => {
  it('should encode ascii using base64 algo', () => {
    const phoneNumber = '+11111111111';
    expect(encodeAscii(phoneNumber)).toBe('KzExMTExMTExMTEx');
  });
});

describe('decodeAscii', () => {
  it('should decode ascii using base64 algo', () => {
    const encodedPhoneNumber = 'KzExMTExMTExMTEx';
    expect(decodeAscii(encodedPhoneNumber)).toBe('+11111111111');
  });
});
