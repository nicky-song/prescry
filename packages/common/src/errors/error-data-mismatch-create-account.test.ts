// Copyright 2022 Prescryptive Health, Inc.

import { ErrorUserDataMismatch } from './error-data-mismatch-create-account';

describe('ErrorUserDataMismatch', () => {
  it('should create instance of ErrorUserDataMismatch', () => {
    const error = new ErrorUserDataMismatch('fake-error');
    expect(error).toBeInstanceOf(ErrorUserDataMismatch);
    expect(error).toEqual(new Error('fake-error'));
  });
});
