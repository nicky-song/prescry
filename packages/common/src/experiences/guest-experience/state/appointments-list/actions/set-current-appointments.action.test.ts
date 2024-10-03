// Copyright 2021 Prescryptive Health, Inc.

import { defaultAppointmentsListState } from './../appointments-list.state';
import { setCurrentAppointmentsAction } from './set-current-appointments.action';

describe('setCurrentAppointmentsAction', () => {
  it('returns action', () => {
    const action = setCurrentAppointmentsAction(defaultAppointmentsListState.appointments, defaultAppointmentsListState.start, defaultAppointmentsListState.appointmentsType, defaultAppointmentsListState.batchSize);
    expect(action.type).toEqual('SET_CURRENT_APPOINTMENTS');
    expect(action.payload).toEqual({ appointments: defaultAppointmentsListState.appointments, start: defaultAppointmentsListState.start, appointmentsType: defaultAppointmentsListState.appointmentsType, batchSize: defaultAppointmentsListState.batchSize });
  });
});