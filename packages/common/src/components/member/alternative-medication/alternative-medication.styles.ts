// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IAlternativeMedicationStyles {
  prescriptionTagListViewStyle: ViewStyle;
  prescriptionTitleViewStyle: ViewStyle;
  pricingTextViewStyle: ViewStyle;
  chevronCardViewStyle: ViewStyle;
}

export const alternativeMedicationStyles: IAlternativeMedicationStyles = {
  prescriptionTagListViewStyle: {
    marginTop: Spacing.base,
  },
  prescriptionTitleViewStyle: {
    marginTop: Spacing.base,
  },
  pricingTextViewStyle: {
    marginTop: Spacing.base,
  },
  chevronCardViewStyle: {
    flexDirection: 'column',
  },
};
