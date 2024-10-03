// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IAppointmentLocationStyles {
  titleTextStyle: TextStyle;
  viewStyle: ViewStyle;
  linkViewStyle: ViewStyle;
}

export const appointmentLocationStyles: IAppointmentLocationStyles = {
  titleTextStyle: {
    marginBottom: Spacing.half,
    marginTop: Spacing.half,
  },
  viewStyle: {
    alignItems: 'flex-start',
  },
  linkViewStyle: {
    marginTop: Spacing.quarter,
    marginBottom: Spacing.quarter,
  },
};
