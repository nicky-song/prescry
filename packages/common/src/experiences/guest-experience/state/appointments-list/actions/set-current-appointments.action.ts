// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentsListAction } from './appointments-list.action';
import { IAppointmentListItem } from '../../../../../models/api-response/appointment.response';
import { IAppointmentType } from './../../../../../components/member/lists/appointments-list/appointments-list';

export type ISetCurrentAppointmentsAction = IAppointmentsListAction<'SET_CURRENT_APPOINTMENTS'>;

export const setCurrentAppointmentsAction = (appointments: IAppointmentListItem[], start: number, appointmentsType: IAppointmentType, batchSize: number): ISetCurrentAppointmentsAction => ({
  type: 'SET_CURRENT_APPOINTMENTS',
  payload: { appointments, start, appointmentsType, batchSize }
});