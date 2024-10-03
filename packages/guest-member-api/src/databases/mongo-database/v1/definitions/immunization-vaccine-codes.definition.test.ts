// Copyright 2021 Prescryptive Health, Inc.

import { ImmunizationVaccineCodesDefinition } from './immunization-vaccine-codes.definition';

describe('ImmunizationVaccineCodesDefinition()', () => {
  it('creates instance of SchemaDefinition<IVaccineCode>', () => {
    const result = ImmunizationVaccineCodesDefinition();
    expect(result).toMatchObject({
      code: { type: String, required: true },
      system: { type: String, required: false },
      display: { type: String, required: false },
    });
  });
});
