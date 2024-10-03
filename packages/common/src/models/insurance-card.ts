// Copyright 2022 Prescryptive Health, Inc.

export interface IInsuranceCard {
  firstName: string;
  lastName: string;
  memberId: string;
  dateOfBirth: string;
  payerId: string;
  policyId: string;
  groupId?: string;
  payerName?: string;
  isActive: boolean;
}

export interface IPolicyHolder {
  policyHolder: string;
  policyHolderFirstName: string;
  policyHolderLastName: string;
  policyHolderDOB: string;
}

export interface IInsuranceInformation {
  insuranceCard: IInsuranceCard;
  policyHolder: IPolicyHolder;
}
