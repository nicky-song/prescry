// Copyright 2021 Prescryptive Health, Inc.

export interface ILoginRequestBody {
  firstName: string;
  lastName: string;
  primaryMemberRxId?: string;
  dateOfBirth: string;
  accountRecoveryEmail: string;
  prescriptionId?: string;
  claimAlertId?: string;
  isBlockchain?: boolean;
}
