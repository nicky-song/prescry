// Copyright 2022 Prescryptive Health, Inc.

export class ErrorActivationRecordMismatch extends Error {
  public code?: number;
  constructor(errorMessage: string, code?: number) {
    super(errorMessage);
    this.code = code;
    Object.setPrototypeOf(this, ErrorActivationRecordMismatch.prototype);
  }
}
