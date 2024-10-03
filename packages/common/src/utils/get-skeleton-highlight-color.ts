// Copyright 2022 Prescryptive Health, Inc.

import { StyleProp, TextStyle, StyleSheet } from 'react-native';
import { GrayScaleColor } from '../theming/colors';

export const getSkeletonHighlightColor = (
  textStyle: StyleProp<TextStyle>,
  defaultTextStyle: TextStyle
): string | undefined => {
  const textStyleColor = StyleSheet.flatten(textStyle)?.color;
  const highlightColor =
    textStyleColor ?? defaultTextStyle.color ?? GrayScaleColor.white;

  return highlightColor?.toString();
};
