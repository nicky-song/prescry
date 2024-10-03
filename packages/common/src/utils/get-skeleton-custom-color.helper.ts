// Copyright 2022 Prescryptive Health, Inc.

import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../theming/colors';

export const getSkeletonCustomColor = (
  viewStyle: StyleProp<ViewStyle>,
  defaultViewStyle: ViewStyle
): string | undefined => {
  const viewStyleColor =
    StyleSheet.flatten(viewStyle)?.backgroundColor?.toString();
  const customColor =
    viewStyleColor ?? defaultViewStyle.backgroundColor ?? GrayScaleColor.white;

  return customColor.toString();
};
