// Copyright 2023 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IPricingOptionGroupStyles {
  defaultViewStyle: ViewStyle;
}

export const pricingOptionGroupStyle: IPricingOptionGroupStyles = {
  defaultViewStyle: {
    marginBottom: Spacing.base,
  },
};
