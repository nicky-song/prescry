// Copyright 2020 Prescryptive Health, Inc.

export interface IPatientTestResult {
  primaryMemberRxId: string;
  productOrService: string;
  fillDate: Date;
  provider: string;
  icd10: string[];
  orderNumber: string;
  claimOptionId?: string;
}
