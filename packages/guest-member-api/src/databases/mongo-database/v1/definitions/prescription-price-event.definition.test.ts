// Copyright 2021 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { PrescriptionPriceEventDefinition } from './prescription-price-event.definition';

describe('PrescriptionPriceEventDefinition()', () => {
  it('creates instance of SchemaDefinition<IPrescriptionPriceEvent>', () => {
    const prescriptionPriceSchema = {} as Schema;
    const eventIdentifierSchema = {} as Schema;
    const result = PrescriptionPriceEventDefinition(
      prescriptionPriceSchema,
      eventIdentifierSchema
    );
    expect(result).toMatchObject({
      identifiers: [{ type: eventIdentifierSchema, required: true }],
      eventData: { type: prescriptionPriceSchema, required: true },
      createdBy: { type: String, required: true },
      createdOn: { type: Number, required: true },
      tags: { type: [String], required: false },
      eventType: { type: String, required: true },
    });
  });
});
