// Copyright 2023 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../../../theming/spacing';

export interface IPricingOptionsScreenStyles {
  separatorViewStyle: ViewStyle;
  selectYourPricingOptionViewStyle: ViewStyle;
  pricingOptionGroupViewStyle: ViewStyle;
}

export const pricingOptionsScreenStyles: IPricingOptionsScreenStyles = {
  separatorViewStyle: {
    marginTop: Spacing.times2,
    marginBottom: Spacing.times1pt5,
  },
  selectYourPricingOptionViewStyle: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pricingOptionGroupViewStyle: {
    marginTop: Spacing.times1pt5,
  },
};
