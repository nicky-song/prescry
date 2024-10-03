// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';
import { RedScale } from '../../../../../theming/theme';
export interface IFindPharmacyScreenStyle {
  headerViewStyle: ViewStyle;
  errorMessageTextStyle: TextStyle;
  findPharmacyTextStyle: TextStyle;
  findPharmacySubTextStyle: TextStyle;
  pharmacyResultViewStyle: ViewStyle;
  displayMoreButtonViewStyle: ViewStyle;
}

export const findYourPharmacyStyle: IFindPharmacyScreenStyle = {
  headerViewStyle: { paddingBottom: 0 },
  findPharmacyTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    marginBottom: Spacing.base,
  },
  findPharmacySubTextStyle: {
    marginBottom: Spacing.threeQuarters,
  },
  pharmacyResultViewStyle: {
    alignItems: 'stretch',
    flexDirection: 'column',
    marginTop: Spacing.base,
    minHeight: 160,
  },
  displayMoreButtonViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.times1pt5,
  },
  errorMessageTextStyle: {
    marginTop: Spacing.base,
    color: RedScale.regular,
  },
};
