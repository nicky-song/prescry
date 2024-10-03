// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { Spacing } from '../../../../../theming/spacing';
import { FontSize } from '../../../../../theming/fonts';

export interface IPhoneNumberLoginScreenStyles {
  termsAndConditionsContainerViewStyle: ViewStyle;
  buttonViewStyleSecondary: ViewStyle;
  buttonViewStylePrimary: ViewStyle;
  notHaveAccountViewStyle: ViewStyle;
  smallTextStyle: TextStyle;
  bottomContentViewStyle: ViewStyle;
  bodyContentContainerViewStyle: ViewStyle;
}

export const phoneNumberLoginScreenStyles: IPhoneNumberLoginScreenStyles = {
  termsAndConditionsContainerViewStyle: {
    marginBottom: Spacing.times1pt5,
  },
  buttonViewStyleSecondary: {
    marginBottom: Spacing.times1pt5,
  },
  buttonViewStylePrimary: {},
  notHaveAccountViewStyle: {
    marginTop: Spacing.times1pt5,
    alignItems: 'center',
  },
  smallTextStyle: {
    fontSize: FontSize.small,
  },
  bottomContentViewStyle: {
    marginTop: Spacing.times1pt5,
    flex: 1,
    justifyContent: 'flex-end',
  },
  bodyContentContainerViewStyle: {
    flex: 1,
  },
};
