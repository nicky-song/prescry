// Copyright 2022 Prescryptive Health, Inc.

export class ErrorUserDataMismatch extends Error {
  public code?: number;
  constructor(errorMessage: string, code?: number) {
    super(errorMessage);
    this.code = code;
    Object.setPrototypeOf(this, ErrorUserDataMismatch.prototype);
  }
}
