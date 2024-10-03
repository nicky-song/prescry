// Copyright 2021 Prescryptive Health, Inc.

export class SmsNotSupportedError extends Error {
  constructor() {
    super('SMS not supported');
    Object.setPrototypeOf(this, SmsNotSupportedError.prototype);
  }
}
