// Copyright 2021 Prescryptive Health, Inc.

import { setCurrentAppointmentsDispatch } from './set-current-appointments.dispatch';
import { setCurrentAppointmentsAction } from '../actions/set-current-appointments.action';
import { defaultAppointmentsListState } from '../appointments-list.state';

describe('setAppointmentsListDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setCurrentAppointmentsDispatch(dispatchMock, defaultAppointmentsListState.appointments, defaultAppointmentsListState.start, defaultAppointmentsListState.appointmentsType, defaultAppointmentsListState.batchSize);

    const expectedAction = setCurrentAppointmentsAction(defaultAppointmentsListState.appointments, defaultAppointmentsListState.start, defaultAppointmentsListState.appointmentsType, defaultAppointmentsListState.batchSize);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
