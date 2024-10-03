// Copyright 2020 Prescryptive Health, Inc.

import {
  appointmentConfirmationScreenContent,
  IAppointmentConfirmationScreenContent,
} from './appointment-confirmation.screen.content';

describe('appointmentConfirmationScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IAppointmentConfirmationScreenContent = {
      cancelButtonLabel: 'Cancel appointment',
      modalTopContent: 'Are you sure you want to cancel?',
      errorModalTopContent:
        'This is taking longer than usual. Please check back at a later time or contact us at {support-email} for assistance.',
      errorModalPrimaryContent: 'Close',
      modalPrimaryContent: 'Yes, cancel',
      modalSecondaryContent: 'Keep appointment',
      confirmationTitle: 'Appointment confirmed',
      appointmentRequestedTitle: 'Appointment requested',
      appointmentRequestedDescription:
        'Thank you for requesting an appointment for **{appointment-date} at {appointment-time}**. You will receive a text message once your appointment is confirmed.',
      appointmentCancelledTitle: 'Appointment canceled',
      appointmentCancelledDescription:
        'Your appointment with {location-name} on **{appointment-date} at {appointment-time}** has been **canceled**.',
      pastAppointmentTitle: 'Past appointment',
      pastAppointmentDescriptionIntro: 'Thank you for visiting',
      pastAppointmentDescriptionEnding:
        'on **{appointment-date} at {appointment-time}**',
    };

    expect(appointmentConfirmationScreenContent).toEqual(expectedContent);
  });
});
