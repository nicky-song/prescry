// Copyright 2021 Prescryptive Health, Inc.

import { ImageStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';

export interface IBenefitsListStyles {
  itemImageStyle: ImageStyle;
  middleItemViewStyle: ViewStyle;
}

export const benefitsListStyles: IBenefitsListStyles = {
  itemImageStyle: {
    height: 40,
    width: 40,
    maxWidth: 40,
  },
  middleItemViewStyle: {
    marginTop: Spacing.times2,
    marginBottom: Spacing.times2,
  },
};
