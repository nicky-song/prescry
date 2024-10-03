// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { BaseText } from '../../text/base-text/base-text';
import { appointmentInstructionsStyles } from './appointment-instructions.styles';

export interface IAppointmentInstructionsProps {
  cancelWindowHours: string;
  screenDescription?: string;
  usecancel?: boolean;
  cancellationPolicy?: string;
}

export const AppointmentInstructions = (
  props: IAppointmentInstructionsProps
) => {
  const { screenDescription, cancelWindowHours, cancellationPolicy } = props;
  let appointmentInstructionText = screenDescription;
  if (cancellationPolicy) {
    const parameterMap = new Map<string, string>([
      ['cancel-window-hours', cancelWindowHours],
    ]);
    const formattedDetails = StringFormatter.format(
      cancellationPolicy,
      parameterMap
    );
    appointmentInstructionText += ` ${formattedDetails}`;
  }

  return (
    <View>
      <BaseText
        style={
          appointmentInstructionsStyles.appointmentInstructionsDescriptionTextStyle
        }
      >
        {appointmentInstructionText}
      </BaseText>
    </View>
  );
};
