// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { PurpleScale } from '../../../theming/theme';

const buttonContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const outerCircleDiameter = 24;

const outerCircle: ViewStyle = {
  maxHeight: outerCircleDiameter,
  height: outerCircleDiameter,
  maxWidth: outerCircleDiameter,
  width: outerCircleDiameter,
  borderRadius: 0.5 * outerCircleDiameter,
  borderWidth: 2,
  borderColor: PurpleScale.darkest,
  alignItems: 'center',
  justifyContent: 'center',
};

const innerCircleDiameter = 16;

const innerCircle: ViewStyle = {
  maxHeight: innerCircleDiameter,
  height: innerCircleDiameter,
  maxWidth: innerCircleDiameter,
  width: innerCircleDiameter,
  borderRadius: 0.5 * innerCircleDiameter,
  backgroundColor: PurpleScale.darkest,
};

const buttonText: TextStyle = {
  marginLeft: Spacing.threeQuarters,
  ...getFontFace(),
  fontSize: FontSize.small,
};

const buttonTopText: TextStyle = {
  ...buttonText,
  ...getFontFace({ weight: FontWeight.semiBold }),
  marginBottom: Spacing.quarter,
};

export const radioButtonStyles = {
  buttonContainer,
  outerCircle,
  innerCircle,
  buttonText,
  buttonTopText,
};
