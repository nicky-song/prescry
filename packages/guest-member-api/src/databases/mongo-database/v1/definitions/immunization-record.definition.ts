// Copyright 2020 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IImmunizationRecord } from '../../../../models/immunization-record';

export const ImmunizationRecordDefinition = (
  protocolAppliedSchema: Schema,
  immunizationVaccineCodeSchema: Schema
): SchemaDefinition<IImmunizationRecord> => ({
  immunizationId: { type: String, required: true },
  orderNumber: { type: String, required: true },
  manufacturer: { type: String, required: true },
  lotNumber: { type: String, required: true },
  protocolApplied: { type: protocolAppliedSchema, required: true },
  memberRxId: { type: String, required: true },
  vaccineCodes: [{ type: immunizationVaccineCodeSchema, required: true }],
});
