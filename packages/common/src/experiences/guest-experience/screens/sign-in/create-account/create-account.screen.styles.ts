// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { NotificationColor } from '../../../../../theming/colors';
import { FontSize } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';

export interface ICreateAccountScreenStyles {
  headingTextStyle: TextStyle;
  bodyViewStyle: ViewStyle;
  haveAccountTextStyle: TextStyle;
  haveAccountViewStyle: ViewStyle;
  errorTextStyle: TextStyle;
  errorColorTextStyle: Pick<TextStyle, 'color'>;
  continueButtonViewStyle: ViewStyle;
}

export const createAccountScreenStyles: ICreateAccountScreenStyles = {
  headingTextStyle: {
    marginBottom: Spacing.base,
  },
  bodyViewStyle: {
    alignSelf: 'stretch',
  },
  haveAccountTextStyle: {
    fontSize: FontSize.small,
  },
  haveAccountViewStyle: {
    marginTop: Spacing.times2,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'fit-content',
    flexDirection: 'row',
  },
  errorTextStyle: {
    marginTop: Spacing.threeQuarters,
  },
  errorColorTextStyle: {
    color: NotificationColor.red,
  },
  continueButtonViewStyle: {
    marginTop: Spacing.times2
  }
};
