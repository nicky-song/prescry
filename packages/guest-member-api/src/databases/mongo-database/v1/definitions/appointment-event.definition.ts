// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentEvent } from '../../../../models/appointment-event';
import { Schema, SchemaDefinition } from 'mongoose';

export const AppointmentEventDefinition = (
  appointmentSchema: Schema,
  eventIdentifierSchema: Schema
): SchemaDefinition<IAppointmentEvent> => ({
  identifiers: [{ type: eventIdentifierSchema, required: true }],
  eventData: { type: appointmentSchema, required: true },
  createdBy: { type: String, required: true },
  createdOn: { type: Number, required: true },
  tags: { type: [String], required: false },
  eventType: { type: String, required: true },
});
