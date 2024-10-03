// Copyright 2022 Prescryptive Health, Inc.

export class RequestError extends Error {
  public httpCode: number;
  public internalCode?: number;

  constructor(httpCode: number, errorMessage: string, internalCode?: number) {
    super(errorMessage);
    this.httpCode = httpCode;
    this.internalCode = internalCode;
    Object.setPrototypeOf(this, RequestError.prototype);
  }
}
