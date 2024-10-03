// Copyright 2023 Prescryptive Health, Inc.

export class ErrorNewDependentPrescription extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorNewDependentPrescription.prototype);
  }
}
