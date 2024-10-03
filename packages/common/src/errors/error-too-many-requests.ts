// Copyright 2018 Prescryptive Health, Inc.

import { ErrorTwilioService } from './error-twilio-service';
export class TooManyRequestError extends ErrorTwilioService {
  constructor(errorMessage: string) {
    super(errorMessage);
    Object.setPrototypeOf(this, TooManyRequestError.prototype);
  }
}
