// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentItem } from '../../../../../models/api-response/appointment.response';
import { createBookingResponseAction } from './create-booking-response.action';

describe('createBookingResponseAction', () => {
  it('returns action', () => {
    const mockResponseData = {
      serviceName: 'COVID-19 AntiBody Test',
      status: 'Accepted',
      orderNumber: '1234567',
      date: 'date',
      time: 'time',
    } as unknown as IAppointmentItem;

    const action = createBookingResponseAction(mockResponseData);
    expect(action.type).toEqual('CREATE_BOOKING_RESPONSE');
    expect(action.payload).toEqual(mockResponseData);
  });
});
