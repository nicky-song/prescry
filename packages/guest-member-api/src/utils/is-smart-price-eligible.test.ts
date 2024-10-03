// Copyright 2021 Prescryptive Health, Inc.

import { isSmartpriceUser } from './is-smart-price-eligible';

describe('isSmartpriceUser', () => {
  it.each([
    ['CASH01', true],
    ['SMARTPRICE', true],
    ['HMA01', false],
    ['', false],
  ])(
    'smartpriceUser (%p, %p)',
    (rxSubGroup: string, expectedValue: boolean) => {
      expect(isSmartpriceUser(rxSubGroup)).toEqual(expectedValue);
    }
  );
});
