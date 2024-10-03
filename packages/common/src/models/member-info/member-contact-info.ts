// Copyright 2018 Prescryptive Health, Inc.

import { RxGroupTypes } from '../member-profile/member-profile-info';

export interface IMemberContactInfo {
  identifier?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  isPhoneNumberVerified?: boolean;
  primaryMemberFamilyId?: string;
  primaryMemberPersonCode?: string;
  primaryMemberRxId?: string;
  phoneNumber?: string;
  isPrimary?: boolean;
  email?: string;
  isLimited?: boolean;
  secondaryAlertCarbonCopyIdentifier?: string;
  secondaryAlertChildCareTakerIdentifier?: string;
  isNumberRecentlyUpdated?: boolean;
  isPinEnabled?: boolean;
  issuerNumber?: string;
  rxGroup?: string;
  rxGroupType: RxGroupTypes;
  rxBin?: string;
  carrierPCN?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  age?: number;
}
