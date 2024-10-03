// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentAction } from './appointment-action';

export type ISetCalendarMonthAction = IAppointmentAction<
  'APPOINTMENT_SET_CALENDAR_MONTH',
  string
>;

export const setCalendarMonthAction = (
  currentMonth: string
): ISetCalendarMonthAction => ({
  payload: currentMonth,
  type: 'APPOINTMENT_SET_CALENDAR_MONTH',
});
