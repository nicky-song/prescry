// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../experiences/guest-experience/api/api-response-messages';
import { ErrorJsonWebTokenExpired } from './error-jsonwebtoken-expired';

describe('ErrorJsonWebTokenExpired', () => {
  it('should create instance of ErrorJsonWebTokenExpired', () => {
    const error = new ErrorJsonWebTokenExpired(new Error('fake-error'));
    expect(error).toBeInstanceOf(ErrorJsonWebTokenExpired);
    expect(error).toEqual(new Error(ErrorConstants.JWT_TOKEN_EXPIRED));
  });
});
