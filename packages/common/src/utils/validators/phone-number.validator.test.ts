// Copyright 2021 Prescryptive Health, Inc.

import { isPhoneNumberValid } from './phone-number.validator';

describe('isPhoneNumberValid', () => {
  it('should accept valid phone ', () => {
    expect(isPhoneNumberValid('+15555555555')).toBe(true);
  });

  it('should fail if invalid phone ', () => {
    expect(isPhoneNumberValid('5555555555')).toBe(false);
    expect(isPhoneNumberValid('+1512312555555555')).toBe(false);
  });
});
