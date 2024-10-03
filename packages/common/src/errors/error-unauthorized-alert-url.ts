// Copyright 2018 Prescryptive Health, Inc.

export class ErrorUnauthorizedAlertUrl extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorUnauthorizedAlertUrl.prototype);
  }
}
