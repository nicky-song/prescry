// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { FontSize } from '../../../theming/fonts';

export interface IAppointmentInstructionsStyles {
  appointmentInstructionsDescriptionTextStyle: TextStyle;
  appointmentInstructionsCancelDescriptionTextStyle: TextStyle;
}

export const appointmentInstructionsStyles: IAppointmentInstructionsStyles = {
  appointmentInstructionsDescriptionTextStyle: {
    fontSize: FontSize.small,
  },
  appointmentInstructionsCancelDescriptionTextStyle: {
    fontSize: FontSize.small,
  },
};
