// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { FontSize, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface ILoginPinScreenStyle {
  bodyContainerViewStyle: ViewStyle;
  bodyViewStyle: ViewStyle;
  buttonViewStyle: ViewStyle;
  headerView: ViewStyle;
  pinLabelTextStyle: TextStyle;
  forgotPinViewStyle: ViewStyle;
}

const bodyContainerViewStyle: ViewStyle = {
  paddingBottom: 0,
  alignSelf: 'stretch',
};

const buttonViewStyle: ViewStyle = {
  marginTop: Spacing.base,
};

const bodyViewStyle: ViewStyle = {
  alignItems: 'center',
  flex: 1,
  flexDirection: 'column',
  marginLeft: Spacing.times1pt5,
  marginRight: Spacing.times1pt5,
  marginBottom: Spacing.times1pt5,
};

const headerView: ViewStyle = {
  alignItems: 'stretch',
  alignSelf: 'stretch',
  flexGrow: 0,
};

const pinLabelTextStyle: TextStyle = {
  color: PrimaryColor.darkPurple,
  fontSize: FontSize.xLarge,
  ...getFontFace(),
  lineHeight: 35,
  margin: Spacing.times1pt5,
};

const forgotPinViewStyle: ViewStyle = {
  marginTop: Spacing.base,
};

export const loginPinScreenStyles: ILoginPinScreenStyle = {
  bodyContainerViewStyle,
  bodyViewStyle,
  buttonViewStyle,
  headerView,
  pinLabelTextStyle,
  forgotPinViewStyle,
};
