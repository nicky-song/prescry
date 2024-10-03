// Copyright 2022 Prescryptive Health, Inc.

import { ErrorActivationRecordMismatch } from './error-activation-record-mismatch';

describe('ErrorActivationRecordMismatch', () => {
  it('should create instance of ErrorUserDataMismatch', () => {
    const error = new ErrorActivationRecordMismatch('fake-error');
    expect(error).toBeInstanceOf(ErrorActivationRecordMismatch);
    expect(error).toEqual(new Error('fake-error'));
  });
});
