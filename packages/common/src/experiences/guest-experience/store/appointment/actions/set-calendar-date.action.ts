// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentAction } from './appointment-action';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';

export interface ISetCalendarActionPayload {
  selectedDate: string | undefined;
  slotsForSelectedDate: IAvailableSlot[];
}
export type ISetCalendarDateAction = IAppointmentAction<
  'APPOINTMENT_SET_CALENDAR_DATE',
  ISetCalendarActionPayload
>;

export const setCalendarDateAction = (
  selectedDate: string | undefined,
  slotsForSelectedDate: IAvailableSlot[]
): ISetCalendarDateAction => ({
  payload: { selectedDate, slotsForSelectedDate },
  type: 'APPOINTMENT_SET_CALENDAR_DATE',
});
