// Copyright 2020 Prescryptive Health, Inc.

export interface IMember {
  identifier: string;
  firstName: string;
  lastName: string;
  isPhoneNumberVerified?: boolean;
  primaryMemberRxId?: string;
  phoneNumber?: string;
  isPrimary?: boolean;
  email?: string;
  isLimited: boolean;
  secondaryAlertCarbonCopyIdentifier?: string;
  secondaryAlertChildCareTakerIdentifier?: string;
  primaryMemberFamilyId?: string;
  primaryMemberPersonCode?: string;
  age: number;
}
