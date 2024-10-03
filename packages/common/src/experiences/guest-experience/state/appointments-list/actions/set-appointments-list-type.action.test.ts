// Copyright 2021 Prescryptive Health, Inc.

import { setAppointmentsListTypeAction } from './set-appointments-list-type.action';

describe('setAppointmentsListTypeAction', () => {
  it('returns action', () => {
    const action = setAppointmentsListTypeAction('cancelled');
    expect(action.type).toEqual('SET_APPOINTMENTS_TYPE');
    expect(action.payload).toEqual({appointmentsType: 'cancelled'});
  });
});