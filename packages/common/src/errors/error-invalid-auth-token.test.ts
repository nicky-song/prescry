// Copyright 2021 Prescryptive Health, Inc.

import { ErrorInvalidAuthToken } from './error-invalid-auth-token';

describe('ErrorInvalidAuthToken', () => {
  it('should create instance of ErrorInvalidAuthToken', () => {
    const error = new ErrorInvalidAuthToken('fake-error');
    expect(error).toBeInstanceOf(ErrorInvalidAuthToken);
    expect(error).toEqual(new Error('fake-error'));
  });
});
