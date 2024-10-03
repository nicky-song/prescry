// Copyright 2018 Prescryptive Health, Inc.

export class ErrorUnauthorizedAccess extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorUnauthorizedAccess.prototype);
  }
}
