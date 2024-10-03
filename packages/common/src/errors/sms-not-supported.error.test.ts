// Copyright 2021 Prescryptive Health, Inc.

import { SmsNotSupportedError } from './sms-not-supported.error';

describe('SmsNotSupportedError', () => {
  it('creates instance', () => {
    const error = new SmsNotSupportedError();
    expect(error).toBeInstanceOf(SmsNotSupportedError);
    expect(error.message).toEqual('SMS not supported');
  });
});
