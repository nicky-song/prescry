// Copyright 2021 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { WaitListDefinition } from './wait-list.definition';

describe('WaitListDefinition()', () => {
  it('creates instance of SchemaDefinition<IWaitList>', () => {
    const pharmacyInvitationSchema = {} as Schema;
    const result = WaitListDefinition(pharmacyInvitationSchema);
    expect(result).toEqual({
      identifier: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      serviceType: { type: String, required: true },
      location: { type: String, required: false },
      status: { type: String, required: false },
      invitation: { type: pharmacyInvitationSchema, required: false },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      dateOfBirth: { type: String, required: true },
      zipCode: { type: String, required: false },
      maxMilesAway: { type: Number, required: false },
      addedBy: { type: String, required: false },
    });
  });
});
