// Copyright 2020 Prescryptive Health, Inc.

import { ICreateBookingAction } from './create-booking-action';
import { IAppointmentItem } from '../../../../../models/api-response/appointment.response';

export type ICreateBookingResponseAction = ICreateBookingAction<
  'CREATE_BOOKING_RESPONSE',
  IAppointmentItem
>;

export const createBookingResponseAction = (
  data: IAppointmentItem
): ICreateBookingResponseAction => ({
  payload: data,
  type: 'CREATE_BOOKING_RESPONSE',
});
