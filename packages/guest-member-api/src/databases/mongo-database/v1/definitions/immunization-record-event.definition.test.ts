// Copyright 2021 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { ImmunizationRecordEventDefinition } from './immunization-record-event.definition';

describe('ImmunizationRecordEventDefinition()', () => {
  it('creates instance of SchemaDefinition<IImmunizationRecordEvent>', () => {
    const ImmunizationRecordSchema = {} as Schema;
    const eventIdentifierSchema = {} as Schema;
    const result = ImmunizationRecordEventDefinition(
      ImmunizationRecordSchema,
      eventIdentifierSchema
    );
    expect(result).toMatchObject({
      identifiers: [{ type: eventIdentifierSchema, required: true }],
      eventData: { type: ImmunizationRecordSchema, required: true },
      createdBy: { type: String, required: true },
      createdOn: { type: Number, required: true },
      eventType: { type: String, required: true },
      tags: { type: [String], required: false },
    });
  });
});
