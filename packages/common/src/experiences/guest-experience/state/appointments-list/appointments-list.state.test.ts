// Copyright 2021 Prescryptive Health, Inc.

import { appointmentsListContent } from '../../../../components/member/lists/appointments-list/appointments-list.content';
import { defaultAppointmentsListState, IAppointmentsListState } from './appointments-list.state';

describe('AppointmentsListState', () => {
  it('has expected default state', () => {
    const expectedDefaultAppointmentsListState: IAppointmentsListState = {
      appointmentsType: 'upcoming',
      start: 0,
      appointments: [],
      allAppointmentsReceived: false,
      batchSize: appointmentsListContent.appointmentBatchSize
    };
    expect(defaultAppointmentsListState).toEqual(expectedDefaultAppointmentsListState)
  });
});