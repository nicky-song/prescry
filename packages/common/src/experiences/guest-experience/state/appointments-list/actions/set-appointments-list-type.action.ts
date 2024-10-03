// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentType } from '../../../../../components/member/lists/appointments-list/appointments-list';
import { IAppointmentsListAction } from './appointments-list.action';

export type ISetAppointmentsListTypeAction = IAppointmentsListAction<'SET_APPOINTMENTS_TYPE'>;

export const setAppointmentsListTypeAction = (appointmentsListType: IAppointmentType): ISetAppointmentsListTypeAction => ({
  type: 'SET_APPOINTMENTS_TYPE',
  payload: {appointmentsType: appointmentsListType}
});

