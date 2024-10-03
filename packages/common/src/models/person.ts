// Copyright 2018 Prescryptive Health, Inc.

import { RxGroupTypes } from './member-profile/member-profile-info';

export interface IPerson {
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
  secondaryAlertCarbonCopyIdentifier?: string;
  secondaryAlertChildCareTakerIdentifier?: string;
  primaryMemberPersonCode: string;
  issuerNumber?: string;
  brokerAssociation?: string;
  rxGroup: string;
  rxGroupType: RxGroupTypes;
  rxBin: string;
  carrierPCN: string;
  address1?: string;
  address2?: string;
  county?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  rxSubGroup?: string;
  effectiveDate?: string;
  terminationDate?: string;
  isTestMembership?: boolean;
  source?: string;
  activationPhoneNumber?: string;
  masterId?: string;
  accountId?: string;
}
