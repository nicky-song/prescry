// Copyright 2021 Prescryptive Health, Inc.

import { setAppointmentsListTypeAction } from '../actions/set-appointments-list-type.action';
import { AppointmentsListDispatch } from './appointments-list.dispatch';
import { IAppointmentType } from '../../../../../components/member/lists/appointments-list/appointments-list';

export const setAppointmentsListTypeDispatch = (
  dispatch: AppointmentsListDispatch,
  appointmentsListType: IAppointmentType
): void => {
  dispatch(setAppointmentsListTypeAction(appointmentsListType));
};
