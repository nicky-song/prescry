// Copyright 2018 Prescryptive Health, Inc.

export class ErrorPhoneNumberMismatched extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorPhoneNumberMismatched.prototype);
  }
}
