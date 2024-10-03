// Copyright 2020 Prescryptive Health, Inc.

import {
  appointmentLocationContent,
  IAppointmentLocationContent,
} from './appointment-location.content';

describe('appointmentLocationContent', () => {
  it('has expected content', () => {
    const expectedContent: IAppointmentLocationContent = {
      title: 'Location',
    };
    expect(appointmentLocationContent).toEqual(expectedContent);
  });
});
