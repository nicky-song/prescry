// Copyright 2018 Prescryptive Health, Inc.

import { PatientDefinition } from './patient';

describe('PendingPrescriptionsListDefinition()', () => {
  it('creates instance of SchemaDefinition<PatientDefinition>', () => {
    const result = PatientDefinition();
    expect(result).toMatchObject({
      email: { type: String, required: true },
      patientId: { type: String, required: true },
    });
  });
});
