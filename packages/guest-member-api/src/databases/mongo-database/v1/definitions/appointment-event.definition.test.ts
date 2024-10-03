// Copyright 2020 Prescryptive Health, Inc.

import { AppointmentEventDefinition } from './appointment-event.definition';
import { Schema } from 'mongoose';

describe('AppointmentEventDefinition()', () => {
  it('creates instance of SchemaDefinition<IAppointmentEvent>', () => {
    const eventIdentifierSchema = {} as Schema;
    const appointmentSchema = {} as Schema;
    const result = AppointmentEventDefinition(
      appointmentSchema,
      eventIdentifierSchema
    );
    expect(result).toMatchObject({
      identifiers: [{ type: eventIdentifierSchema, required: true }],
      eventData: { type: appointmentSchema, required: true },
      createdBy: { type: String, required: true },
      createdOn: { type: Number, required: true },
      tags: { type: [String], required: false },
      eventType: { type: String, required: true },
    });
  });
});
