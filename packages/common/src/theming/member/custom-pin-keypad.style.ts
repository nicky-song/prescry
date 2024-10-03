// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { getFontFace } from '../fonts';
import {
  FontSize,
  getDimension,
  GreyScale,
  LocalDimensions,
  PurpleScale,
} from '../theme';

export const getCircleSize = () => {
  const circleSize = getDimension(LocalDimensions.width, 'width', 0.15);
  return circleSize;
};

export const getMargin = () => {
  const circleMargin = LocalDimensions.width > 600 ? 10 : 8;
  return circleMargin;
};

const commonCircleStyles: ViewStyle = {
  borderRadius: getCircleSize() / 2,
  height: getCircleSize(),
  width: getCircleSize(),
};

const commonFontStyles: TextStyle = {
  fontSize: FontSize.ultraLarge,
  ...getFontFace(),
  margin: 'auto',
  textAlign: 'center',
};

const pinKeypadPurpleCircle: ViewStyle = {
  ...commonCircleStyles,
  backgroundColor: PurpleScale.darkest,
};

const pinKeypadPurpleBorderCircle: ViewStyle = {
  ...commonCircleStyles,
  borderColor: PurpleScale.darkest,
  borderWidth: 1,
};

const pinKeypadGreyCircle: ViewStyle = {
  ...commonCircleStyles,
  borderColor: GreyScale.light,
  borderWidth: 1,
};

const pinKeypadPurpleFont: TextStyle = {
  ...commonFontStyles,
  color: PurpleScale.darkest,
};

const pinKeypadWhiteFont: TextStyle = {
  ...commonFontStyles,
  color: GreyScale.lightest,
};

const pinKeypadGreyFont: TextStyle = {
  ...commonFontStyles,
  color: GreyScale.light,
};

const pinKeypadRowStyle: ViewStyle = {
  flexDirection: 'row',
};

const pinKeypadRowItemStyle: ViewStyle = {
  flex: 1,
  margin: getMargin(),
};

export const customPinKeypadStyle = {
  pinKeypadGreyCircle,
  pinKeypadGreyFont,
  pinKeypadPurpleBorderCircle,
  pinKeypadPurpleCircle,
  pinKeypadPurpleFont,
  pinKeypadRowItemStyle,
  pinKeypadRowStyle,
  pinKeypadWhiteFont,
};
