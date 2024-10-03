// Copyright 2022 Prescryptive Health, Inc.

import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { FontSize } from '../theming/fonts';

export const getSkeletonFontSize = (
  style: StyleProp<TextStyle>,
  defaultStyle: StyleProp<TextStyle>
): number => {
  const defaultFontSize =
    StyleSheet.flatten(defaultStyle)?.fontSize ?? FontSize.body;

  const skeletonHeight = StyleSheet.flatten(style)?.fontSize ?? defaultFontSize;

  return skeletonHeight;
};
