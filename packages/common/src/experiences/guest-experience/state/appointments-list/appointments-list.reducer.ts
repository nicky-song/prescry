// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'react';
import { AppointmentsListAction } from '../../../../experiences/guest-experience/state/appointments-list/actions/appointments-list.action';
import { IAppointmentsListState } from '../../state/appointments-list/appointments-list.state';

export type AppointmentsListReducer = Reducer<IAppointmentsListState, AppointmentsListAction>;

export const appointmentsListReducer: AppointmentsListReducer = (
  state: IAppointmentsListState,
  action: AppointmentsListAction,
): IAppointmentsListState => {
  const { payload } = action;

  switch(action.type) {
    case 'SET_CURRENT_APPOINTMENTS':
      if (payload.appointmentsType !== state.appointmentsType) {
        payload.allAppointmentsReceived = (payload.appointments ?? []).length < (payload.batchSize ?? 5);
        payload.start = (payload.appointments ?? []).length;
      }
      else if (payload.appointments && !payload.appointments.length && payload.start) {
          payload.appointments = state.appointments;
          payload.start = state.start;
          payload.allAppointmentsReceived = true;
        }
      else if (payload.appointments && payload.appointments.length) {
        payload.allAppointmentsReceived = (payload.appointments ?? []).length < (payload.batchSize ?? 5);

        if (payload.start) {
          payload.start = state.start + (payload.appointments ?? []).length;
          payload.appointments = state.appointments.concat(payload.appointments);
        }
        else {
          payload.start = (payload.appointments ?? []).length;
        }
      }
      return { ...state, ...payload };
    default:
      return { ...state, ...payload };
  }
};
