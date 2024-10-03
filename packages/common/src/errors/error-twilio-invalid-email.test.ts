// Copyright 2021 Prescryptive Health, Inc.

import { ErrorTwilioInvalidEmail } from './error-twilio-invalid-email';

describe('ErrorTwilioInvalidEmail', () => {
  it('should create instance of ErrorTwilioInvalidEmail', () => {
    const error = new ErrorTwilioInvalidEmail('fake-error');
    expect(error).toBeInstanceOf(ErrorTwilioInvalidEmail);
    expect(error).toEqual(new Error('fake-error'));
  });
});
