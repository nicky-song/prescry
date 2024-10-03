// Copyright 2018 Prescryptive Health, Inc.

import { MedicationDefinition } from './medication';

describe('MedicationDefinition()', () => {
  it('creates instance of SchemaDefinition<IMedication>', () => {
    const result = MedicationDefinition();
    expect(result).toMatchObject({
      form: { type: String, required: true },
      genericName: { type: String, required: true },
      genericProductId: { type: String, required: true },
      isGeneric: { type: Boolean, required: false },
      medicationId: { type: String, required: true },
      name: { type: String, required: true },
      strength: { type: String, required: true },
      units: { type: String, required: true },
    });
  });
});
