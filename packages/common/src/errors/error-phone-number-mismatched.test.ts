// Copyright 2021 Prescryptive Health, Inc.

import { ErrorPhoneNumberMismatched } from './error-phone-number-mismatched';

describe('ErrorPhoneNumberMismatched', () => {
  it('should create instance of ErrorPhoneNumberMismatched', () => {
    const error = new ErrorPhoneNumberMismatched('fake-error');
    expect(error).toBeInstanceOf(ErrorPhoneNumberMismatched);
    expect(error).toEqual(new Error('fake-error'));
  });
});
