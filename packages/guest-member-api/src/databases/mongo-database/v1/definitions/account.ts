// Copyright 2018 Prescryptive Health, Inc.

import { IAccount } from '@phx/common/src/models/account';
import { SchemaDefinition } from 'mongoose';

export const AccountDefinition = (): SchemaDefinition<IAccount> => ({
  _id: { type: String, required: true },
  accountKey: { type: String, required: false },
  dateOfBirth: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  phoneNumber: { type: String, required: true },
  pinHash: { type: String, required: false },
  recoveryEmail: { type: String, required: false },
  featuresDefault: { type: String, required: false },
  featuresAllowed: { type: String, required: false },
  masterId: { type: String, required: false },
  favoritedPharmacies: { type: [String], required: false },
  isFavoritedPharmaciesFeatureKnown: { type: Boolean, required: false },
  accountId: { type: String, required: false },
  languageCode: { type: String, required: false },
});
