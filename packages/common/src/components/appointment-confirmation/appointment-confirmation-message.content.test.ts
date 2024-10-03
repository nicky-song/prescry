// Copyright 2020 Prescryptive Health, Inc.

import {
  appointmentConfirmationMessageContent,
  IAppointmentConfirmationMessageContent,
} from './appointment-confirmation-message.content';

describe('appointmentConfirmationMessageContent', () => {
  it('has expected content', () => {
    const expectedContent: IAppointmentConfirmationMessageContent = {
      additionalInformationLabel: 'Additional information',
      locationLabel: 'Location',
      refundText:
        'Please allow 5 to 10 business days for refunds to appear on the original form of payment.',
    };

    expect(appointmentConfirmationMessageContent).toEqual(expectedContent);
  });
});
