// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { BorderRadius } from '../../../../theming/borders';
import { GrayScaleColor } from '../../../../theming/colors';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import { FontSize, GreenScale, GreyScale } from '../../../../theming/theme';

export interface IPrescriptionValueCardStyles {
  borderContainerViewStyle: ViewStyle;
  pharmacyNameTextStyle: TextStyle;
  cardViewStyle: ViewStyle;
  leftColumnViewStyle: TextStyle;
  rightColumnViewStyle: ViewStyle;
  rightColumnLabelTextStyle: TextStyle;
  noPriceViewStyle: ViewStyle;
  noPriceTextStyle: TextStyle;
  rowContainerViewStyle: ViewStyle;
  tagValueTextStyle: TextStyle;
  lineSeparatorViewStyle: ViewStyle;
  tagsContainerViewStyle: ViewStyle;
  favoriteTagViewStyle: ViewStyle;
  noteViewStyle: TextStyle;
  priceContainerViewStyle: ViewStyle;
  youPayContainerViewStyle: ViewStyle;
  pricePlanTextStyle: TextStyle;
  youPayTextStyle: TextStyle;
  coPayTextStyle: TextStyle;
  pricingOptionInformativePanelViewStyle: ViewStyle;
}

const cardViewStyle: ViewStyle = {
  flexDirection: 'column',
  paddingTop: Spacing.times2,
  paddingRight: Spacing.times1pt25,
  paddingBottom: Spacing.times2,
  paddingLeft: Spacing.times1pt25,
  backgroundColor: GreyScale.lightest,
  borderTopWidth: 1,
  borderStyle: 'solid',
  borderColor: GrayScaleColor.borderLines,
  minHeight: '14vh',
};

export const prescriptionValueCardStyles: IPrescriptionValueCardStyles = {
  borderContainerViewStyle: {
    ...cardViewStyle,
    borderColor: 'transparent',
    shadowColor: GreyScale.darkest,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
  },
  pharmacyNameTextStyle: {
    marginBottom: Spacing.half,
    ...getFontFace({ weight: FontWeight.bold }),
  },
  cardViewStyle,
  leftColumnViewStyle: {
    flexDirection: 'column',
    flex: 4,
  },
  rightColumnViewStyle: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    flex: 2,
    marginLeft: Spacing.half,
    justifyContent: 'center',
  },
  rightColumnLabelTextStyle: { textAlign: 'right' },
  noPriceViewStyle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  noPriceTextStyle: { textAlign: 'center' },
  rowContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.threeQuarters,
  },
  youPayContainerViewStyle: {
    borderRadius: Spacing.half,
    backgroundColor: GreyScale.lightWhite,
    padding: Spacing.half,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.half,
  },
  tagValueTextStyle: {
    color: GreenScale.medium,
    backgroundColor: GreenScale.lighter,
    padding: Spacing.quarter,
    paddingHorizontal: Spacing.half,
    width: 'fit-content',
    maxWidth: 'fit-content',
    marginBottom: Spacing.base,
    fontSize: FontSize.smallest,
    borderRadius: BorderRadius.half,
    marginRight: Spacing.half,
  },
  tagsContainerViewStyle: { marginBottom: Spacing.base },
  favoriteTagViewStyle: {
    marginBottom: Spacing.base,
  },
  lineSeparatorViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.half,
  },
  noteViewStyle: {
    marginTop: Spacing.base,
    color: GreyScale.lighterDark,
    fontSize: FontSize.small,
  },
  pricePlanTextStyle: { textAlign: 'right', flex: 2 },
  youPayTextStyle: {
    textAlign: 'right',
    flex: 2,
  },
  coPayTextStyle: {
    flexBasis: 'auto',
  },
  pricingOptionInformativePanelViewStyle: {
    marginBottom: Spacing.half,
  },
};
