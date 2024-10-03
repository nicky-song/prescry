// Copyright 2021 Prescryptive Health, Inc.

import { IClaimOptionServices } from '../../../../models/services';
import { Schema, SchemaDefinition } from 'mongoose';

export const ClaimOptionDefinition = (
  icd10CodeSchema: Schema,
  immunizationVaccineCodeSchema: Schema
): SchemaDefinition<IClaimOptionServices> => ({
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
