// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { NotificationColor } from '../../../theming/colors';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IAppointmentScreenStyles {
  bookButtonEnabledViewStyle: ViewStyle;
  bookButtonDisabledViewStyle: ViewStyle;
  errorTextStyle: TextStyle;
  unfinishedQuestionsTextStyle: TextStyle;
  expirationWarningTextStyle: TextStyle;
  aboutDependentHeaderTextStyle: TextStyle;
  questionsSubHeaderTextStyle: TextStyle;
  questionsHeaderContainer: ViewStyle;
  consentViewStyle: ViewStyle;
  questionViewStyle: ViewStyle;
}

const timeSlotExpirationTextStyle: TextStyle = {
  paddingLeft: 1,
  marginBottom: Spacing.base,
  fontSize: FontSize.small,
};

export const appointmentScreenStyles: IAppointmentScreenStyles = {
  bookButtonEnabledViewStyle: {
    marginBottom: 40,
    marginTop: 40,
  },
  bookButtonDisabledViewStyle: {
    marginBottom: 40,
    marginTop: 44,
  },
  errorTextStyle: {
    color: NotificationColor.red,
    fontSize: FontSize.small,
  },
  unfinishedQuestionsTextStyle: {
    color: NotificationColor.red,
    fontSize: FontSize.small,
    marginTop: 18,
  },
  expirationWarningTextStyle: {
    ...timeSlotExpirationTextStyle,
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
  aboutDependentHeaderTextStyle: {
    marginBottom: Spacing.threeQuarters,
  },
  questionsSubHeaderTextStyle: {
    fontSize: FontSize.small,
    marginBottom: 2,
  },
  questionsHeaderContainer: {
    marginTop: Spacing.times2,
  },
  consentViewStyle: {
    marginTop: Spacing.times2,
  },
  questionViewStyle: {
    marginTop: Spacing.threeQuarters,
  },
};
