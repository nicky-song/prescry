// Copyright 2021 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { ImmunizationRecordDefinition } from './immunization-record.definition';

describe('ImmunizationRecordDefinition()', () => {
  it('creates instance of SchemaDefinition<IImmunizationRecord>', () => {
    const protocolAppliedSchema = {} as Schema;
    const immunizationVaccineCodeSchema = {} as Schema;
    const result = ImmunizationRecordDefinition(
      protocolAppliedSchema,
      immunizationVaccineCodeSchema
    );
    expect(result).toMatchObject({
      immunizationId: { type: String, required: true },
      orderNumber: { type: String, required: true },
      manufacturer: { type: String, required: true },
      lotNumber: { type: String, required: true },
      protocolApplied: { type: protocolAppliedSchema, required: true },
      memberRxId: { type: String, required: true },
      vaccineCodes: [{ type: immunizationVaccineCodeSchema, required: true }],
    });
  });
});
