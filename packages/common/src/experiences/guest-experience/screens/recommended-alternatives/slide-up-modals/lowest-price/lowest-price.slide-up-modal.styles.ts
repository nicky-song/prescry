// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../../../theming/spacing';

export interface ILowestPriceSlideUpModalStyles {
  descriptionTextStyle: TextStyle;
  claimPharmacyInfoViewStyle: ViewStyle;
}

export const lowestPriceSlideUpModalStyles: ILowestPriceSlideUpModalStyles = {
  descriptionTextStyle: {
    marginBottom: Spacing.times2,
  },
  claimPharmacyInfoViewStyle: {
    marginBottom: Spacing.half,
  },
};
