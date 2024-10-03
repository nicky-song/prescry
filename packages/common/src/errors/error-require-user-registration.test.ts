// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../theming/constants';
import { ErrorRequireUserRegistration } from './error-require-user-registration';

describe('ErrorRequireUserRegistration', () => {
  it('should create instance of ErrorRequireUserRegistration', () => {
    const error = new ErrorRequireUserRegistration();
    expect(error).toBeInstanceOf(ErrorRequireUserRegistration);
    expect(error).toEqual(
      new Error(ErrorConstants.errorRequireUserRegistration)
    );
  });
});
