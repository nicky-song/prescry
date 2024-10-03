// Copyright 2022 Prescryptive Health, Inc.

export interface IProviderDetails {
  providerName: string;
  npiNumber: string;
}

export interface IProviderDetailsResponse {
  providerDetails?: IProviderDetails;
  errorCode?: number;
  message: string;
}
