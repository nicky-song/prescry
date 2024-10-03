// Copyright 2018 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IPrescription } from '@phx/common/src/models/prescription';

export const PrescriptionDefinition = (
  contactInfoSchema: Schema,
  fillOptionsSchema: Schema
): SchemaDefinition<IPrescription> => ({
  expiresOn: { required: true, type: Date },
  fillOptions: [{ type: fillOptionsSchema, required: true }],
  isNewPrescription: { required: false, type: Boolean },
  isPriorAuthRequired: { required: false, type: Boolean },
  lastFilledOn: { required: false, type: Date },
  prescribedOn: { required: true, type: Date },
  prescriber: { required: true, type: contactInfoSchema },
  referenceNumber: { required: true, type: String },
  sig: { required: true, type: String },
});
