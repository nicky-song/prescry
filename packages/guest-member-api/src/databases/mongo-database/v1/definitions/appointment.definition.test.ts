// Copyright 2020 Prescryptive Health, Inc.

import { AppointmentDefinition } from './appointment.definition';
import { Schema } from 'mongoose';

describe('AppointmentDefinition()', () => {
  it('creates instance of SchemaDefinition<IAppointment>', () => {
    const appointmentInfoSchema = {} as Schema;
    const questionsSchema = {} as Schema;
    const checkoutSchema = {} as Schema;
    const claimInformationSchema = {} as Schema;
    const result = AppointmentDefinition(
      appointmentInfoSchema,
      questionsSchema,
      checkoutSchema,
      claimInformationSchema
    );
    expect(result).toMatchObject({
      questions: [{ type: questionsSchema, required: true }],
      appointment: { type: appointmentInfoSchema, required: true },
      sessionId: { type: String, required: true },
      serviceType: { type: String, required: true },
      payment: { type: checkoutSchema, required: false },
      claimInformation: { type: claimInformationSchema, required: false },
      orderNumber: { type: String, required: true },
      bookingStatus: { type: String, required: true },
      isTestAppointment: { type: Boolean, required: true },
      isDependentAppointment: { type: Boolean, required: false },
      inviteCode: { type: String, required: false },
      contractFee: { type: Number, required: false },
    });
  });
});
