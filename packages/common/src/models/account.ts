// Copyright 2018 Prescryptive Health, Inc.

import { LanguageCode } from './language';

export interface IAccount {
  _id: string;
  dateOfBirth?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  pinHash?: string;
  accountKey?: string;
  recoveryEmail?: string;
  featuresDefault?: string;
  featuresAllowed?: string;
  masterId?: string;
  favoritedPharmacies?: string[];
  isFavoritedPharmaciesFeatureKnown?: boolean;
  accountId?: string;
  isVerified?: boolean;
  languageCode?: LanguageCode;
}
