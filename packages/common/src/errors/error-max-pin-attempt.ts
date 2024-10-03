// Copyright 2018 Prescryptive Health, Inc.

export class ErrorMaxPinAttempt extends Error {
  public numberOfFailedAttempts: number;
  constructor(errorMessage: string, numberOfFailedAttempts: number) {
    super(errorMessage);
    this.numberOfFailedAttempts = numberOfFailedAttempts;
    Object.setPrototypeOf(this, ErrorMaxPinAttempt.prototype);
  }
}
