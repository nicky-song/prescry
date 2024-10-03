// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IPricingAtPharmacyNameTextStyles {
  textStyle: TextStyle;
  pricingAtPharmacyNameViewStyles: ViewStyle;
}

const pricingAtPharmacyNameViewStyles: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: Spacing.times2,
  flex: 1,
};

export const pricingAtPharmacyNameTextStyles: IPricingAtPharmacyNameTextStyles =
  {
    textStyle: {
      ...getFontFace({ weight: FontWeight.semiBold }),
    },
    pricingAtPharmacyNameViewStyles,
  };
