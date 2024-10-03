// Copyright 2021 Prescryptive Health, Inc.

export interface IVerifyMembershipRequestBody {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  primaryMemberRxId: string;
  phoneNumber: string;
  isBlockchain?: boolean;
}
