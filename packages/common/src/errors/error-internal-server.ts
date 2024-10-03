// Copyright 2018 Prescryptive Health, Inc.

export class ErrorInternalServer extends Error {
  public apiType?: string;
  constructor(errorMessage: string, apiType?: string) {
    super(errorMessage);
    this.apiType = apiType;
    Object.setPrototypeOf(this, ErrorInternalServer.prototype);
  }
}
