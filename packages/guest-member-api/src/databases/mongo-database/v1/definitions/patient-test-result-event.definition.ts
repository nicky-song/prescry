// Copyright 2018 Prescryptive Health, Inc.

import { IPatientTestResult } from '../../../../models/patient-test-result';
import { Schema, SchemaDefinition } from 'mongoose';
import { IHealthRecordEvent } from '../../../../models/health-record-event';

export type IPatientTestResultEvent = IHealthRecordEvent<IPatientTestResult>;

export const PatientTestResultEventDefinition = (
  patientResultSchema: Schema,
  eventIdentifierSchema: Schema
): SchemaDefinition<IPatientTestResultEvent> => ({
  identifiers: [{ type: eventIdentifierSchema, required: true }],
  eventData: { type: patientResultSchema, required: true },
  createdBy: { type: String, required: true },
  createdOn: { type: Number, required: true },
  tags: { type: [String], required: false },
  eventType: { type: String, required: true },
});
