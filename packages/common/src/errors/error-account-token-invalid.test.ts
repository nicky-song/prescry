// Copyright 2021 Prescryptive Health, Inc.

import { ErrorAccountTokenInvalid } from './error-account-token-invalid';

describe('ErrorAccountTokenInvalid', () => {
  it('should create instance of ErrorAccountTokenInvalid', () => {
    const error = new ErrorAccountTokenInvalid();
    expect(error).toBeInstanceOf(ErrorAccountTokenInvalid);
  });
});
