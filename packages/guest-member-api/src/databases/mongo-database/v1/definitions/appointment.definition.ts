// Copyright 2020 Prescryptive Health, Inc.

import { IAppointment } from '../../../../models/appointment-event';
import { Schema, SchemaDefinition } from 'mongoose';

export const AppointmentDefinition = (
  appointmentInfoSchema: Schema,
  questionsSchema: Schema,
  checkoutSchema: Schema,
  claimInformationSchema: Schema
): SchemaDefinition<IAppointment> => ({
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
