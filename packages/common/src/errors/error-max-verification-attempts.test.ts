// Copyright 2021 Prescryptive Health, Inc.

import { ErrorMaxVerificationAttempt } from './error-max-verification-attempts';

describe('ErrorMaxVerificationAttempt', () => {
  it('should create instance of ErrorMaxVerificationAttempt', () => {
    const error = new ErrorMaxVerificationAttempt('error', true);
    expect(error).toBeInstanceOf(ErrorMaxVerificationAttempt);
  });
});
