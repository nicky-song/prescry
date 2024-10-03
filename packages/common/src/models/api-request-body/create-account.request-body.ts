// Copyright 2021 Prescryptive Health, Inc.

export interface ICreateAccountRequestBody {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  code: string;
  phoneNumber: string;
  primaryMemberRxId?: string;
  prescriptionId?: string;
  isBlockchain?: boolean;
}
