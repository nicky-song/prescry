// Copyright 2018 Prescryptive Health, Inc.

export class ErrorTwilioService extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorTwilioService.prototype);
  }
}
