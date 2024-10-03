// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentAction } from './appointment-action';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { IMarkedDate } from '../../../../../components/member/appointment-calendar/appointment-calendar';

export interface ICalendarStatus {
  slots: IAvailableSlot[];
  markedDates: IMarkedDate;
}

export type ISetCalendarStatusAction = IAppointmentAction<
  'APPOINTMENT_SET_CALENDAR_STATUS',
  ICalendarStatus
>;

export const setCalendarStatusAction = (
  calendarStatus: ICalendarStatus
): ISetCalendarStatusAction => ({
  payload: calendarStatus,
  type: 'APPOINTMENT_SET_CALENDAR_STATUS',
});
