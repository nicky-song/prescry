// Copyright 2018 Prescryptive Health, Inc.

import { PersonDefinition } from './person';

describe('PersonDefinition()', () => {
  it('creates instance of SchemaDefinition<IPerson>', () => {
    const result = PersonDefinition();
    expect(result).toEqual({
      address1: { type: String, required: false },
      address2: { type: String, required: false },
      carrierPCN: { type: String, required: true },
      county: { type: String, required: false },
      city: { type: String, required: false },
      country: { type: String, required: false },
      dateOfBirth: { type: String, required: true },
      effectiveDate: { type: String, required: false },
      email: { type: String, required: true },
      firstName: { type: String, required: true },
      identifier: { type: String, required: true },
      isPhoneNumberVerified: { type: Boolean, required: true },
      isPrimary: { type: Boolean, required: true },
      issuerNumber: { type: String, required: false },
      isTestMembership: { type: Boolean, required: false },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      primaryMemberFamilyId: { type: String, required: false },
      primaryMemberPersonCode: { type: String, required: true },
      primaryMemberRxId: { type: String, required: true },
      rxBin: { type: String, required: true },
      brokerAssociation: { type: String, required: false },
      rxGroup: { type: String, required: true },
      rxGroupType: { type: String, required: true },
      rxSubGroup: { type: String, required: false },
      secondaryAlertCarbonCopyIdentifier: { type: String, required: false },
      secondaryAlertChildCareTakerIdentifier: { type: String, required: false },
      state: { type: String, required: false },
      terminationDate: { type: String, required: false },
      zip: { type: String, required: false },
      source: { type: String, required: false },
      activationPhoneNumber: { type: String, required: false },
      masterId: { type: String, required: false },
      accountId: { type: String, required: false },
    });
  });
});
