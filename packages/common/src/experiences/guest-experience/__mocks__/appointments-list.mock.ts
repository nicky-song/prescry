// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentListItem } from '../../../models/api-response/appointment.response';
import { BookingStatus } from '../../../models/api-response/appointment.response';

const mockBookingStatus: BookingStatus = 'Confirmed' as BookingStatus;

export const appointmentsListMock: IAppointmentListItem[] = [{
  customerName: 'mock-customer-name',
  orderNumber: 'mock-order-number',
  locationName: 'mock-location-name',
  date: 'mock-date',
  time: 'mock-time',
  serviceDescription: 'mock-service-description',
  bookingStatus: mockBookingStatus,
  startInUtc: new Date(),
  serviceType: 'mock-service-type',
  appointmentLink: 'mock-appointment-link',
}];
