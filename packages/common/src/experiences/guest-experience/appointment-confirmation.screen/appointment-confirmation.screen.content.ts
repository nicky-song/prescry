// Copyright 2020 Prescryptive Health, Inc.

export interface IAppointmentConfirmationScreenContent {
  cancelButtonLabel: string;
  modalTopContent: string;
  errorModalTopContent: string;
  errorModalPrimaryContent: string;
  modalPrimaryContent: string;
  modalSecondaryContent: string;
  confirmationTitle: string;
  appointmentRequestedTitle: string;
  appointmentRequestedDescription: string;
  appointmentCancelledTitle: string;
  appointmentCancelledDescription: string;
  pastAppointmentTitle: string;
  pastAppointmentDescriptionIntro: string;
  pastAppointmentDescriptionEnding: string;
}

export const appointmentConfirmationScreenContent: IAppointmentConfirmationScreenContent =
  {
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
