// Copyright 2021 Prescryptive Health, Inc.

import { ErrorTwilioService } from './error-twilio-service';

export class ErrorTwilioInvalidEmail extends ErrorTwilioService {
  constructor(errorMessage: string) {
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorTwilioInvalidEmail.prototype);
  }
}
