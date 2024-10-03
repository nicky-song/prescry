// Copyright 2018 Prescryptive Health, Inc.

export class ErrorInvalidAuthToken extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorInvalidAuthToken.prototype);
  }
}
