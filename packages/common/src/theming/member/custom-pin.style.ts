// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { GreyScale, PurpleScale } from '../theme';

export interface ICustomPinStyle {
  backButtonTargetAreaView: ViewStyle;
  circleShapeSmall: ViewStyle;
  pinKeypadStyle: ViewStyle;
  purpleCircleColor: ViewStyle;
  whiteCircleColor: ViewStyle;
}

const backButtonTargetAreaView: ViewStyle = {
  alignItems: 'center',
  paddingTop: 8,
};

const circleShapeSmall: ViewStyle = {
  borderRadius: 16,
  borderWidth: 1,
  flexGrow: 0,
  height: 19.8,
  width: 19.8,
};

const whiteCircleColor: ViewStyle = {
  backgroundColor: GreyScale.lightest,
  borderColor: PurpleScale.darkest,
};

const purpleCircleColor: ViewStyle = {
  backgroundColor: PurpleScale.darkest,
  borderColor: PurpleScale.darkest,
};

const pinKeypadStyle: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  marginTop: 12,
};

export const customPinStyle: ICustomPinStyle = {
  backButtonTargetAreaView,
  circleShapeSmall,
  pinKeypadStyle,
  purpleCircleColor,
  whiteCircleColor,
};
