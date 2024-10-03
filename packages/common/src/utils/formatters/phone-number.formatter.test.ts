// Copyright 2019 Prescryptive Health, Inc.

import {
  formatPhoneNumber,
  cleanPhoneNumber,
  formatPhoneNumberForApi,
} from './phone-number.formatter';

describe('PhoneNumberFormatter', () => {
  it('formats amount', () => {
    expect(formatPhoneNumber('0123456789')).toEqual('(012) 345-6789');
    expect(formatPhoneNumber('01234567890')).toEqual('(123) 456-7890');
    expect(formatPhoneNumber('(012) 345 6789')).toEqual('(012) 345-6789');
    expect(formatPhoneNumber('012-345-6789')).toEqual('(012) 345-6789');
    expect(formatPhoneNumber('1012-345-6789')).toEqual('(012) 345-6789');
    expect(formatPhoneNumber('01234567891234')).toEqual('01234567891234');

    expect(formatPhoneNumber('123')).toEqual('123');
    expect(formatPhoneNumber('test')).toEqual('');
  });

  it('cleanFormat', () => {
    expect(cleanPhoneNumber('(012)3456789')).toEqual('0123456789');
    expect(cleanPhoneNumber('0 (123) 456-789')).toEqual('0123456789');
    expect(cleanPhoneNumber('(012) 345 6789')).toEqual('0123456789');
    expect(cleanPhoneNumber('012-345-6789')).toEqual('0123456789');
    expect(cleanPhoneNumber('112-345-6789')).toEqual('1123456789');
  });

  it.each([
    ['', undefined, ''],
    ['1234567890', undefined, '+11234567890'],
    ['1234567890', '1', '+11234567890'],
    ['1234567890', '011', '+0111234567890'],
    ['1234567890', '+1', '+11234567890'],
    ['1234567890', '+011', '+0111234567890'],
    ['(123)456-7890', undefined, '+11234567890'],
    ['(123) 456-7890 ', undefined, '+11234567890'],
    [' 123.456.7890', undefined, '+11234567890'],
    ['+11234567890', undefined, '+11234567890'],
    ['+0111234567890', '011', '+0111234567890'],
    ['+1 (123) 456-7890', undefined, '+11234567890'],
    ['1-123-456-7890', undefined, '+11234567890'],
    ['011-123-456-7890', '011', '+0111234567890'],
  ])(
    'formats %p for api',
    (
      phoneNumber: string,
      countryCode: string | undefined,
      expectedPhoneNumber: string
    ) => {
      expect(formatPhoneNumberForApi(phoneNumber, countryCode)).toEqual(
        expectedPhoneNumber
      );
    }
  );
});
