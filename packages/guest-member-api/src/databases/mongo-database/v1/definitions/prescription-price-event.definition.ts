// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionPriceEvent } from '../../../../models/prescription-price-event';
import { Schema, SchemaDefinition } from 'mongoose';

export const PrescriptionPriceEventDefinition = (
  prescriptionPriceSchema: Schema,
  eventIdentifierSchema: Schema
): SchemaDefinition<IPrescriptionPriceEvent> => ({
  identifiers: [{ type: eventIdentifierSchema, required: true }],
  eventData: { type: prescriptionPriceSchema, required: true },
  createdBy: { type: String, required: true },
  createdOn: { type: Number, required: true },
  tags: { type: [String], required: false },
  eventType: { type: String, required: true },
});
