// Copyright 2020 Prescryptive Health, Inc.

import { AppointmentInfoDefinition } from './appointment-info.definition';

describe('AppointmentInfoDefinition()', () => {
  it('creates instance of SchemaDefinition<IAppointmentInfo>', () => {
    const result = AppointmentInfoDefinition();
    expect(result).toMatchObject({
      serviceId: { type: String, required: false },
      serviceName: { type: String, required: true },
      start: { type: Date, required: true },
      startInUtc: { type: Date, required: true },
      timezone: { type: String, required: true },
      customerName: { type: String, required: true },
      customerPhone: { type: String, required: true },
      bookingId: { type: String, required: true },
      locationId: { type: String, required: true },
      resource: { type: String, required: true },
      memberRxId: { type: String, required: true },
      acceptMessageText: { type: String, required: true },
      declineMessageText: { type: String, required: true },
      status: { type: String, required: false },
      procedureCode: { type: String, required: true },
      serviceDescription: { type: String, required: true },
    });
  });
});
