// Copyright 2023 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IPricingOptionContextContainerStyles {
  prescpritionTitleViewStyle: ViewStyle;
}

export const pricingOptionContextContainerStyles: IPricingOptionContextContainerStyles =
  {
    prescpritionTitleViewStyle: {
      marginBottom: Spacing.times1pt25,
    },
  };
