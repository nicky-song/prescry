// Copyright 2018 Prescryptive Health, Inc.

export abstract class ErrorWithCode<TCode = number> extends Error {
  public code: TCode;
  public innerError?: Error;

  constructor(errorMessage: string, code: TCode, innerError?: Error) {
    super(errorMessage);
    this.code = code;
    this.innerError = innerError;
    Object.setPrototypeOf(this, ErrorWithCode.prototype);
  }
}
