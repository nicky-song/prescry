// Copyright 2022 Prescryptive Health, Inc.

export class EndpointError extends Error {
  public errorCode: number;

  constructor(errorCode: number, errorMessage?: string) {
    super(errorMessage);
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, EndpointError.prototype);
  }
}
