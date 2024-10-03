// Copyright 2023 Prescryptive Health, Inc.

export interface IValidateIdentityRequest {
  accountId: string;
  smartContractAddress: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  consent: boolean;
}
