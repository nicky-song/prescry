// Copyright 2018 Prescryptive Health, Inc.

export class ErrorBadRequest extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorBadRequest.prototype);
  }
}
