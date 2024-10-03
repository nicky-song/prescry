// Copyright 2021 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IImmunizationRecordEvent } from '../../../../models/immunization-record';

export const ImmunizationRecordEventDefinition = (
  ImmunizationRecordSchema: Schema,
  eventIdentifierSchema: Schema
): SchemaDefinition<IImmunizationRecordEvent> => ({
  identifiers: [{ type: eventIdentifierSchema, required: true }],
  eventData: { type: ImmunizationRecordSchema, required: true },
  createdBy: { type: String, required: true },
  createdOn: { type: Number, required: true },
  eventType: { type: String, required: true },
  tags: { type: [String], required: false },
});
