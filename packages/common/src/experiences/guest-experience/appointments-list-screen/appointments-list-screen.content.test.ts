// Copyright 2020 Prescryptive Health, Inc.

import {
  appointmentsListScreenContent,
  IAppointmentsListScreenContent,
} from './appointments-list-screen.content';

describe('appointmentsListScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IAppointmentsListScreenContent = {
      headerText: 'Appointments',
      scheduleAppointmentButtonText: 'Schedule an appointment',
    };
    expect(appointmentsListScreenContent).toEqual(expectedContent);
  });
});
