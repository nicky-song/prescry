// Copyright 2021 Prescryptive Health, Inc.

import { ErrorMaxPinAttempt } from './error-max-pin-attempt';

describe('ErrorMaxPinAttempt', () => {
  it('should create instance of ErrorMaxPinAttempt', () => {
    const error = new ErrorMaxPinAttempt('error', 10);
    expect(error).toBeInstanceOf(ErrorMaxPinAttempt);
  });
});
