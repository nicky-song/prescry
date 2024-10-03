// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { getFontFace } from '../../../theming/fonts';
import {
  FontSize,
  getDimension,
  GreyScale,
  LocalDimensions,
  PurpleScale,
} from '../../../theming/theme';

export interface IPinKeypadCircleStyles {
  pinKeypadGreyCircle: ViewStyle;
  pinKeypadGreyFont: TextStyle;
  pinKeypadPurpleBorderCircle: ViewStyle;
  pinKeypadPurpleCircle: ViewStyle;
  pinKeypadPurpleFont: TextStyle;
  pinKeypadWhiteFont: TextStyle;
}

export const getCircleSize = () => {
  const circleSize = getDimension(LocalDimensions.width, 'width', 0.15);
  if (circleSize < 48) return 48;
  else if (circleSize > 128) return 128;
  else return circleSize;
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

export const pinKeypadCircleStyles: IPinKeypadCircleStyles = {
  pinKeypadGreyCircle,
  pinKeypadGreyFont,
  pinKeypadPurpleBorderCircle,
  pinKeypadPurpleCircle,
  pinKeypadPurpleFont,
  pinKeypadWhiteFont,
};
