// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import {
  IAppointmentInstructionsProps,
  AppointmentInstructions,
} from './appointment-instructions';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { appointmentInstructionsStyles } from './appointment-instructions.styles';
import { BaseText } from '../../text/base-text/base-text';

const mockCancellationPolicy =
  'Cancellations must be submitted at least {cancel-window-hours} hours in advance of your appointment.';

const appointmentInstructionsProps: IAppointmentInstructionsProps = {
  screenDescription:
    'Choose appointment date and time. Testing takes approximately 15 minutes.',
  cancelWindowHours: '6',
  cancellationPolicy: mockCancellationPolicy,
};

describe('AppointmentInstructions', () => {
  it('renders correctly with cancellation text ', () => {
    const appointmentInstructions = renderer.create(
      <AppointmentInstructions {...appointmentInstructionsProps} />
    );

    const parameterMap = new Map<string, string>([
      ['cancel-window-hours', appointmentInstructionsProps.cancelWindowHours],
    ]);
    const formattedDetails = StringFormatter.format(
      mockCancellationPolicy,
      parameterMap
    );

    const textElements = appointmentInstructions.root.findAllByType(BaseText);

    expect(textElements.length).toEqual(1);
    expect(textElements[0].props.children).toEqual(
      `${appointmentInstructionsProps.screenDescription} ${formattedDetails}`
    );
    expect(textElements[0].props.style).toEqual(
      appointmentInstructionsStyles.appointmentInstructionsDescriptionTextStyle
    );
  });

  it('renders correctly without cancellation policy ', () => {
    const appointmentInstructions = renderer.create(
      <AppointmentInstructions
        {...appointmentInstructionsProps}
        cancellationPolicy={undefined}
      />
    );

    const textElements = appointmentInstructions.root.findAllByType(BaseText);

    expect(textElements.length).toEqual(1);
    expect(textElements[0].props.children).toEqual(
      appointmentInstructionsProps.screenDescription
    );
    expect(textElements[0].props.style).toEqual(
      appointmentInstructionsStyles.appointmentInstructionsDescriptionTextStyle
    );
  });
});
