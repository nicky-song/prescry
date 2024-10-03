// Copyright 2018 Prescryptive Health, Inc.

import { AccountDefinition } from './account';

describe('AccountDefinition()', () => {
  it('creates instance of SchemaDefinition<IAccount>', () => {
    const result = AccountDefinition();
    expect(result).toMatchObject({
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
      accountId: { type: String, required: false },
      favoritedPharmacies: { type: [String], required: false },
      isFavoritedPharmaciesFeatureKnown: { type: Boolean, required: false },
      languageCode: { type: String, required: false },
    });
  });
});
