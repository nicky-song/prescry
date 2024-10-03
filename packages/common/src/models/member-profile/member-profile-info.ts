// Copyright 2021 Prescryptive Health, Inc.

import { LanguageCode } from '../language';

export enum RxGroupTypesEnum {
  CASH = 'CASH',
  SIE = 'SIE',
  COVID19 = 'COVID19',
}

export type RxGroupTypes = keyof typeof RxGroupTypesEnum;

export const RX_SUB_GROUP_DEFAULT = 'CASH01';

export interface IProfile {
  rxGroupType: string;
  primary: IPrimaryProfile;
  childMembers?: IDependentProfile[];
  adultMembers?: IDependentProfile[];
}

export interface IPrimaryProfile {
  identifier: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  isPhoneNumberVerified?: boolean;
  primaryMemberFamilyId?: string;
  primaryMemberPersonCode?: string;
  primaryMemberRxId: string;
  phoneNumber: string;
  isPrimary?: boolean;
  email?: string;
  isLimited?: boolean;
  secondaryAlertCarbonCopyIdentifier?: string;
  secondaryAlertChildCareTakerIdentifier?: string;
  isNumberRecentlyUpdated?: boolean;
  issuerNumber?: string;
  brokerAssociation?: string;
  rxGroup?: string;
  rxGroupType: RxGroupTypes;
  rxSubGroup: string;
  rxBin?: string;
  carrierPCN?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  age?: number;
  masterId?: string;
  accountId?: string;
}

export interface IDependentProfile {
  identifier: string;
  firstName: string;
  lastName: string;
  isLimited?: boolean;
  isPrimary: boolean;
  primaryMemberFamilyId?: string;
  primaryMemberPersonCode?: string;
  primaryMemberRxId?: string;
  secondaryAlertCarbonCopyIdentifier?: string;
  secondaryAlertChildCareTakerIdentifier?: string;
  age?: number;
  rxGroupType?: RxGroupTypes;
  rxSubGroup: string;
  email?: string;
  phoneNumber?: string;
  masterId?: string;
}

export interface ILimitedAccount {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  recoveryEmail?: string;
  phoneNumber: string;
  favoritedPharmacies: string[];
  isFavoritedPharmaciesFeatureKnown?: boolean;
  languageCode?: LanguageCode;
}
