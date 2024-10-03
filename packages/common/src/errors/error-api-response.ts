// Copyright 2018 Prescryptive Health, Inc.

export class ErrorApiResponse extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorApiResponse.prototype);
  }
}
