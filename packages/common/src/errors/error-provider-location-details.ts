// Copyright 2021 Prescryptive Health, Inc.

export class ErrorProviderLocationDetails extends Error {
  public apiType?: string;
  public code?: number;
  constructor(errorMessage: string, apiType?: string, code?: number) {
    super(errorMessage);
    this.apiType = apiType;
    this.code = code;
    Object.setPrototypeOf(this, ErrorProviderLocationDetails.prototype);
  }
}
