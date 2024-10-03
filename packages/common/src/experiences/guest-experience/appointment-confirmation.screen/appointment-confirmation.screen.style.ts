// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IAppointmentConfirmationScreenStyle {
  bodyViewStyle: ViewStyle;
  headerViewStyle: ViewStyle;
  headerTextStyle: TextStyle;
  titleTextStyle: TextStyle;
  secondaryButtonViewStyle: ViewStyle;
}

const headerTextStyle: TextStyle = {
  marginBottom: 24,
};

const headerViewStyle: ViewStyle = {
  paddingBottom: 0,
};

const bodyViewStyle: ViewStyle = {
  flexDirection: 'column',
  margin: 24,
};

const secondaryButtonViewStyle: ViewStyle = {
  marginTop: Spacing.times1pt25,
};

export const appointmentConfirmationScreenStyle: IAppointmentConfirmationScreenStyle =
  {
    bodyViewStyle,
    headerViewStyle,
    headerTextStyle,
    titleTextStyle: {
      marginBottom: Spacing.base,
    },
    secondaryButtonViewStyle,
  };
