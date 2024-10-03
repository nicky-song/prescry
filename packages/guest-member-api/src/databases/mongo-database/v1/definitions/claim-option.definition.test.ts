// Copyright 2021 Prescryptive Health, Inc.

import { ClaimOptionDefinition } from './claim-option.definition';
import { Schema } from 'mongoose';

describe('ClaimOptionDefinition()', () => {
  it('creates instance of SchemaDefinition<IClaimOptionServices>', () => {
    const icd10CodeSchema = {} as Schema;
    const immunizationVaccineCodeSchema = {} as Schema;

    const result = ClaimOptionDefinition(
      icd10CodeSchema,
      immunizationVaccineCodeSchema
    );
    expect(result).toMatchObject({
      claimOptionId: { type: String, required: true },
      text: { type: String, required: false },
      ndc: { type: String, required: false },
      qualifier: { type: String, required: false },
      manufacturer: { type: String, required: false },
      factSheetLinks: { type: [String], required: false },
      icd10Code: { type: icd10CodeSchema, required: true },
      productOrServiceId: { type: String, required: true },
      cptCode: { type: immunizationVaccineCodeSchema, required: false },
    });
  });
});
