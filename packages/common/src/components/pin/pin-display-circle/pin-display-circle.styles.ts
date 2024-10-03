// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
export interface IPinDisplayCircleStyles {
  circleShapeSmall: ViewStyle;
  whiteCircleColor: ViewStyle;
  purpleCircleColor: ViewStyle;
}

const circleShapeSmall: ViewStyle = {
  borderRadius: 16,
  borderWidth: 1,
  flexGrow: 0,
  height: 19.8,
  width: 19.8,
};

const whiteCircleColor: ViewStyle = {
  backgroundColor: GrayScaleColor.white,
  borderColor: PrimaryColor.prescryptivePurple,
};

const purpleCircleColor: ViewStyle = {
  backgroundColor: PrimaryColor.prescryptivePurple,
  borderColor: PrimaryColor.prescryptivePurple,
};

export const pinDisplayCircleStyles: IPinDisplayCircleStyles = {
  circleShapeSmall,
  whiteCircleColor,
  purpleCircleColor,
};
