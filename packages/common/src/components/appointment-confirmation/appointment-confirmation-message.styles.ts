// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../theming/spacing';

export interface IAppointmentConfirmationMessageStyles {
  additionalContentTextStyle: TextStyle;
  bodyViewStyle: ViewStyle;
  heading2TextStyle: TextStyle;
  refundContentTextStyle: TextStyle;
  formattedDetailsViewStyle: ViewStyle;
  baseTextFormattedDetailsLocationNameStyle: TextStyle;
}

export const appointmentConfirmationMessageStyles: IAppointmentConfirmationMessageStyles =
  {
    additionalContentTextStyle: {
      marginBottom: Spacing.times2,
    },
    bodyViewStyle: {
      alignItems: 'flex-start',
      flex: 1,
    },
    refundContentTextStyle: { marginTop: Spacing.base },
    heading2TextStyle: {
      marginTop: Spacing.base,
      marginBottom: Spacing.base,
    },
    formattedDetailsViewStyle: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    baseTextFormattedDetailsLocationNameStyle: {
      paddingLeft: Spacing.quarter,
      paddingRight: Spacing.quarter,
    },
  };
