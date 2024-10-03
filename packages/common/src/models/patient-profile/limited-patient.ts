// Copyright 2022 Prescryptive Health, Inc.

export interface ILimitedPatient {
  masterId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  rxGroupType: string;
  rxSubGroup: string;
  memberId: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  recoveryEmail?: string;
}
