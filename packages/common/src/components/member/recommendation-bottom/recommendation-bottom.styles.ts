// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { FontSize, GreyScale } from '../../../theming/theme';

const sentToPharmacyText: TextStyle = {
  fontSize: FontSize.small,
  color: GreyScale.lighterDark,
};
const subContainerView: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: GreyScale.lightest,
  width: '100%',
};
const containerView: ViewStyle = {
  alignSelf: 'stretch',
  backgroundColor: GreyScale.lightest,
  paddingLeft: 22,
  paddingRight: 22,
  width: '100%',
};
const planPayContainerView: ViewStyle = {
  ...subContainerView,
  paddingBottom: Spacing.threeQuarters,
};
const youPayContainerView: ViewStyle = {
  ...subContainerView,
};
const youPayText: TextStyle = {
  lineHeight: 30,
};
const youPayPriceText: TextStyle = {
  ...youPayText,
  ...getFontFace({ weight: FontWeight.bold }),
  textAlign: 'right',
};
const planPayPriceText: TextStyle = {
  ...getFontFace({ weight: FontWeight.bold }),
  textAlign: 'right',
};
const pharmacyContainerView: ViewStyle = {
  ...subContainerView,
  justifyContent: 'flex-start',
  paddingBottom: Spacing.base,
};
const sentToViewStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  width: '100%',
  flexWrap: 'wrap',
};

export const recommendationBottomStyles = {
  containerView,
  pharmacyContainerView,
  planPayContainerView,
  planPayPriceText,
  subContainerView,
  youPayContainerView,
  youPayPriceText,
  sentToPharmacyText,
  youPayText,
  sentToViewStyle,
};
