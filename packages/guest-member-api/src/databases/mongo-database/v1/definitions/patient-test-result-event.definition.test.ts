// Copyright 2020 Prescryptive Health, Inc.

import { PatientTestResultEventDefinition } from './patient-test-result-event.definition';
import { Schema } from 'mongoose';

describe('PatientTestResultEventDefinition()', () => {
  it('creates instance of SchemaDefinition<IPatientTestResultEvent>', () => {
    const eventIdentifierSchema = {} as Schema;
    const patientResultSchema = {} as Schema;
    const result = PatientTestResultEventDefinition(
      eventIdentifierSchema,
      patientResultSchema
    );
    expect(result).toMatchObject({
      identifiers: [{ type: eventIdentifierSchema, required: true }],
      eventData: { type: patientResultSchema, required: true },
      createdBy: { type: String, required: true },
      createdOn: { type: Number, required: true },
      tags: { type: [String], required: false },
      eventType: { type: String, required: true },
    });
  });
});
