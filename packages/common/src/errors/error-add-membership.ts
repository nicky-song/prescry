// Copyright 2020 Prescryptive Health, Inc.

export class ErrorAddMembership extends Error {
  public apiType?: string;
  constructor(errorMessage: string, apiType?: string) {
    super(errorMessage);
    this.apiType = apiType;
    Object.setPrototypeOf(this, ErrorAddMembership.prototype);
  }
}
