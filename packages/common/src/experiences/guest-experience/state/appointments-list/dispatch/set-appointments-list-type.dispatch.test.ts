// Copyright 2021 Prescryptive Health, Inc.

import { setAppointmentsListTypeDispatch } from './set-appointments-list-type.dispatch';
import { setAppointmentsListTypeAction } from './../actions/set-appointments-list-type.action';

describe('setAppointmentsListDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setAppointmentsListTypeDispatch(dispatchMock, 'cancelled');

    const expectedAction = setAppointmentsListTypeAction('cancelled');
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
