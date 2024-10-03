// Copyright 2021 Prescryptive Health, Inc.

import { ErrorTwilioService } from './error-twilio-service';

describe('ErrorTwilioService', () => {
  it('should create instance of ErrorTwilioService', () => {
    const error = new ErrorTwilioService('fake-error');
    expect(error).toBeInstanceOf(ErrorTwilioService);
    expect(error).toEqual(new Error('fake-error'));
  });
});
