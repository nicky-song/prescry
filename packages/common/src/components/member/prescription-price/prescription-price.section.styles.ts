// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { FontSize, getFontDimensions } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { GreyScale } from '../../../theming/theme';

export interface IPrescriptionPriceStyles {
  priceContainerViewStyle: ViewStyle;
  contactPharmacyViewStyle: ViewStyle;
  amountContainerViewStyle: ViewStyle;
  amountTextStyle: TextStyle;
  rightTextStyle: TextStyle;
  assistanceProgramTextStyle: TextStyle;
  verifyRealPriceTextStyle: TextStyle;
  amountHighContainerViewStyle: ViewStyle;
}

export const prescriptionPriceStyles: IPrescriptionPriceStyles = {
  priceContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.base,
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
  },
  contactPharmacyViewStyle: {
    padding: Spacing.threeQuarters,
    backgroundColor: GreyScale.lightWhite,
    borderRadius: Spacing.quarter,
  },
  amountContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.base,
  },
  amountHighContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.threeQuarters,
    paddingBottom: Spacing.threeQuarters,
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
  },
  amountTextStyle: {
    flexGrow: 0,
    marginLeft: Spacing.half,
  },
  rightTextStyle: {
    textAlign: 'right',
    flex: 2,
  },
  assistanceProgramTextStyle: {
    ...getFontDimensions(FontSize.small),
    marginTop: Spacing.base,
    marginLeft: Spacing.threeQuarters,
  },
  verifyRealPriceTextStyle: {
    marginTop: Spacing.base,
  },
};
