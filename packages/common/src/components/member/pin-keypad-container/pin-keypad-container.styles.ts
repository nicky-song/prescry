// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { LocalDimensions } from '../../../theming/theme';

export const getMargin = () => {
  const circleMargin = LocalDimensions.width > 600 ? 10 : 8;
  return circleMargin;
};

export interface IPinKeypadContainerStyles {
  pinKeypadRowStyle: ViewStyle;
  pinKeypadRowItemStyle: ViewStyle;
}

const pinKeypadRowStyle: ViewStyle = {
  flexDirection: 'row',
};

const pinKeypadRowItemStyle: ViewStyle = {
  flex: 1,
  margin: getMargin(),
};

export const pinKeypadContainerStyles: IPinKeypadContainerStyles = {
  pinKeypadRowStyle,
  pinKeypadRowItemStyle,
};
