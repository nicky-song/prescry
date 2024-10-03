// Copyright 2020 Prescryptive Health, Inc.

export interface IAppointmentConfirmationMessageContent {
  additionalInformationLabel: string;
  locationLabel: string;
  refundText: string;
}

export const appointmentConfirmationMessageContent: IAppointmentConfirmationMessageContent = {
  additionalInformationLabel: 'Additional information',
  locationLabel: 'Location',
  refundText:
    'Please allow 5 to 10 business days for refunds to appear on the original form of payment.',
};
