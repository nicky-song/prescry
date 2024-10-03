// Copyright 2021 Prescryptive Health, Inc.

export interface ICreateAccount {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  isTermAccepted: boolean;
  primaryMemberRxId?: string;
  prescriptionId?: string;
  isBlockchain?: boolean;
}
