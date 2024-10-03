// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { FontSize, getFontDimensions } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface ILoginBodyStyles {
  dateWrapperViewStyle: ViewStyle;
  loginBodyContainerViewStyle: ViewStyle;
  textFieldsViewStyle: ViewStyle;
  errorTextStyle: TextStyle;
  helpTextStyle: TextStyle;
}

export const loginBodyStyles: ILoginBodyStyles = {
  dateWrapperViewStyle: {
    marginBottom: Spacing.times1pt5,
    marginTop: Spacing.base,
  },
  loginBodyContainerViewStyle: {
    flexDirection: 'column',
  },
  textFieldsViewStyle: {
    marginTop: Spacing.base,
  },
  errorTextStyle: {
    marginTop: Spacing.threeQuarters,
  },
  helpTextStyle: {
    marginTop: Spacing.threeQuarters,
    ...getFontDimensions(FontSize.small),
  },
};
