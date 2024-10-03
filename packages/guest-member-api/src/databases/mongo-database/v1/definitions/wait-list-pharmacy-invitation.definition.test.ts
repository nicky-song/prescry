// Copyright 2021 Prescryptive Health, Inc.

import { WaitListPharmacyInvitationDefinition } from './wait-list-pharmacy-invitation.definition';

describe('WaitListPharmacyInvitationDefinition()', () => {
  it('creates instance of SchemaDefinition<IPharmacyInvitation>', () => {
    const result = WaitListPharmacyInvitationDefinition();
    expect(result).toEqual({
      start: { type: String, required: true },
      end: { type: String, required: true },
    });
  });
});
