// Copyright 2021 Prescryptive Health, Inc.

export class ErrorMaxVerificationAttempt extends Error {
  public reachedMaxVerificationAttempts: boolean;
  constructor(errorMessage: string, reachedMaxVerificationAttempts: boolean) {
    super(errorMessage);
    this.reachedMaxVerificationAttempts = reachedMaxVerificationAttempts;
    Object.setPrototypeOf(this, ErrorMaxVerificationAttempt.prototype);
  }
}
