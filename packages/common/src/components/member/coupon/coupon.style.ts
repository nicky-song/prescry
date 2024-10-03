// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { FontSize, GreyScale } from '../../../theming/theme';

export interface ICouponStyles {
  bottomHalfViewStyle: ViewStyle;
  couponTextStyle: TextStyle;
  dottedLineViewStyle: ViewStyle;
  dataTextStyle: TextStyle;
  logoViewStyle: ViewStyle;
  logoImageStyle: ImageStyle;
  middleContainerViewStyle: ViewStyle;
  productNameTextStyle: TextStyle;
  topHalfViewStyle: ViewStyle;
  semiCircleLeftViewStyle: ViewStyle;
  semiCircleRightViewStyle: ViewStyle;
  payLabelTextStyle: TextStyle;
  priceTextStyle: TextStyle;
  payLabelViewStyle: ViewStyle;
}

const couponTextStyle: TextStyle = {
  fontSize: FontSize.small,
  marginRight: Spacing.base,
  lineHeight: 18,
};

const dataTextStyle: TextStyle = {
  fontSize: FontSize.small,
  ...getFontFace({ weight: FontWeight.semiBold }),
  lineHeight: 18,
};

const bottomHalfViewStyle: ViewStyle = {
  flexDirection: 'row',
  borderRadius: BorderRadius.normal,
  borderWidth: 2,
  borderColor: GreyScale.light,
  borderTopColor: 'transparent',
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  padding: Spacing.times1pt25,
  paddingTop: Spacing.quarter,
  borderTopWidth: 0,
  marginTop: -1,
  height: 100,
};

const topHalfViewStyle: ViewStyle = {
  flexDirection: 'row',
  borderRadius: BorderRadius.normal,
  borderWidth: 2,
  borderColor: GreyScale.light,
  borderBottomColor: 'transparent',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  padding: Spacing.times1pt25,
  paddingBottom: Spacing.half,
  borderBottomWidth: 0,
  marginBottom: -1,
  justifyContent: 'space-between',
};

const logoViewStyle: ViewStyle = {
  flex: 1,
  flexBasis: 'auto',
};

const productNameTextStyle: TextStyle = {
  color: GreyScale.dark,
  fontSize: FontSize.small,
};

const logoImageStyle: ImageStyle = {
  height: 28,
  width: 140,
  maxHeight: 28,
  maxWidth: 140,
};

const priceTextStyle: TextStyle = {
  fontSize: FontSize.impact,
  ...getFontFace({ weight: FontWeight.bold }),
  marginTop: Spacing.half,
};

const middleContainerViewStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  maxHeight: 32,
};

const semiCircleLeftViewStyle: ViewStyle = {
  height: 32,
  width: 16,
  maxWidth: 16,
  maxHeight: 32,
};

const semiCircleRightViewStyle: ViewStyle = {
  ...semiCircleLeftViewStyle,
  ...{ transform: [{ rotate: '180deg' }] },
};

const dottedLineViewStyle: ViewStyle = {
  height: 32,
  maxHeight: 32,
  width: 'auto',
  flex: 1,
};

const payLabelTextStyle: TextStyle = {
  fontSize: FontSize.small,
  lineHeight: 16,
};

const payLabelViewStyle: ViewStyle = { width: 95, alignItems: 'flex-end' };

export const couponStyles: ICouponStyles = {
  bottomHalfViewStyle,
  couponTextStyle,
  dottedLineViewStyle,
  dataTextStyle,
  logoViewStyle,
  logoImageStyle,
  middleContainerViewStyle,
  productNameTextStyle,
  topHalfViewStyle,
  semiCircleLeftViewStyle,
  semiCircleRightViewStyle,
  payLabelTextStyle,
  priceTextStyle,
  payLabelViewStyle,
};
