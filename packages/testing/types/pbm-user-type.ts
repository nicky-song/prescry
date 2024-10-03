// Copyright 2023 Prescryptive Health, Inc.

export type PbmUserType = {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  uniqueId?: string;
  phoneNumberDialingCode: string;
  pin: string;
  primaryMemberFamilyId: string;
  rxSubGroup: string;
  primaryMemberPersonCode: string;
  gender: 'male' | 'female' | 'other';
  unlock: () => Promise<void>;
};
