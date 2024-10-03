// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentListItem } from '../../../../../models/api-response/appointment.response';
import { setCurrentAppointmentsAction } from '../actions/set-current-appointments.action';
import { AppointmentsListDispatch } from './appointments-list.dispatch';
import { IAppointmentType } from './../../../../../components/member/lists/appointments-list/appointments-list';

export const setCurrentAppointmentsDispatch = (
  dispatch: AppointmentsListDispatch,
  appointmentsList: IAppointmentListItem[],
  start: number,
  appointmentsType: IAppointmentType,
  batchSize: number
): void => {
  dispatch(setCurrentAppointmentsAction(appointmentsList, start, appointmentsType, batchSize));
};
