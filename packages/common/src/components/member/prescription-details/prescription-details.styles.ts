// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IPrescriptionDetailsStyles {
  titleTextStyle: TextStyle;
  prescriptionTagListViewStyle: ViewStyle;
  prescriptionTitleViewStyle: ViewStyle;
  pricingTextViewStyle: ViewStyle;
}

export const prescriptionDetailsStyles: IPrescriptionDetailsStyles = {
  titleTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    fontSize: FontSize.small,
  },
  prescriptionTagListViewStyle: {
    marginTop: Spacing.base,
  },
  prescriptionTitleViewStyle: {
    marginTop: Spacing.base,
  },
  pricingTextViewStyle: {
    marginTop: Spacing.base,
  },
};
