// Copyright 2020 Prescryptive Health, Inc.

export interface IMemberDetails {
  identifier: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  isPhoneNumberVerified: boolean;
  primaryMemberRxId: string;
  phoneNumber: string;
  isPrimary: boolean;
  email: string;
  primaryMemberFamilyId?: string;
  primaryMemberPersonCode?: string;
  rxGroupType?: string;
  secondaryAlertCarbonCopyIdentifier?: string;
  secondaryAlertChildCareTakerIdentifier?: string;
}
