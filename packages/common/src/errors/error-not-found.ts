// Copyright 2018 Prescryptive Health, Inc.

export class ErrorNotFound extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorNotFound.prototype);
  }
}
