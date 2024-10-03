// Copyright 2012 Prescryptive Health, Inc.

export class ErrorFavoritingPharmacy extends Error {
  public apiType?: string;
  constructor(errorMessage: string, apiType?: string) {
    super(errorMessage);
    this.apiType = apiType;
    Object.setPrototypeOf(this, ErrorFavoritingPharmacy.prototype);
  }
}
