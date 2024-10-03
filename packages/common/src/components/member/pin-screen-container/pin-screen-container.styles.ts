// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { FontSize, RedScale } from '../../../theming/theme';

export interface IPinScreenContainerStyles {
  containerViewStyle: ViewStyle;
  errorTextStyle: TextStyle;
  pinKeypadStyle: ViewStyle;
}

const containerViewStyle: ViewStyle = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
};

const errorTextStyle: TextStyle = {
  color: RedScale.regular,
  fontSize: FontSize.small,
  ...getFontFace(),
  lineHeight: 17,
  marginTop: Spacing.half,
  textAlign: 'center',
};

const pinKeypadStyle: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  marginTop: Spacing.threeQuarters,
};

export const pinScreenContainerStyles: IPinScreenContainerStyles = {
  containerViewStyle,
  errorTextStyle,
  pinKeypadStyle,
};
