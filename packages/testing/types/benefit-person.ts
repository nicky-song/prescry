// Copyright 2023 Prescryptive Health, Inc.

export type BenefitPerson = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  masterId: string;
  birthDate: string; // Format YYYY-MM-DD
  primaryMemberRxId: string;
  primaryMemberFamilyId: string;
  rxSubGroup: string;
  primaryMemberPersonCode: string;
  gender: 'male' | 'female' | 'other';
};
