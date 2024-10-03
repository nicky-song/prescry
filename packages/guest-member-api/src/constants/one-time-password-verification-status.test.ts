// Copyright 2022 Prescryptive Health, Inc.

import { OneTimePasswordVerificationStatus } from './one-time-password-verification-status';

describe('OneTimePasswordVerificationStatus', () => {
  it('has expected constants', () => {
    const expectedConstants = {
      INVALID_CODE: 'Invalid code',
    };
    expect(OneTimePasswordVerificationStatus).toEqual(expectedConstants);
  });
});
