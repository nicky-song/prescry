// Copyright 2023 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IRxIdCardSectionStyles {
  cardSectionViewStyle: ViewStyle;
  titleTextStyle: TextStyle;
  descriptionViewStyle: ViewStyle;
}

export const rxIdCardSectionStyles: IRxIdCardSectionStyles = {
  cardSectionViewStyle: {
    backgroundColor: GrayScaleColor.lightGray,
    paddingBottom: Spacing.times1pt5,
    paddingLeft: Spacing.times1pt5,
    paddingRight: Spacing.times1pt5,
    paddingTop: Spacing.times1pt5,
  },
  titleTextStyle: { marginBottom: Spacing.base },
  descriptionViewStyle: { marginBottom: Spacing.times1pt5 },
};
