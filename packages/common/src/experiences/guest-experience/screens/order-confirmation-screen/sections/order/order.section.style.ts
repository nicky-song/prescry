// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontSize, getFontDimensions } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';

export interface IOrderSectionStyle {
  drugDetailsViewStyle: ViewStyle;
  heading2TextStyle: TextStyle;
  sectionViewStyle: ViewStyle;
  rowViewStyle: ViewStyle;
  estimatedPriceNoticeTextStyle: TextStyle;
  dualPriceSectionViewStyle: ViewStyle;
  prescriptionPriceSectionViewStyle: ViewStyle;
}

export const orderSectionStyle: IOrderSectionStyle = {
  drugDetailsViewStyle: {
    marginTop: Spacing.base,
  },
  heading2TextStyle: {
    marginBottom: Spacing.base,
  },
  sectionViewStyle: {
    paddingTop: Spacing.times1pt5,
    paddingBottom: Spacing.times1pt5,
  },
  rowViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  estimatedPriceNoticeTextStyle: {
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
    paddingTop: Spacing.base,
    ...getFontDimensions(FontSize.small),
  },
  dualPriceSectionViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.half,
  },
  prescriptionPriceSectionViewStyle: {
    marginTop: Spacing.base,
  },
};
