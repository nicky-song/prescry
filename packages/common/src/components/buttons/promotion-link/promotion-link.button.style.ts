// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import { PurpleScale, GreyScale } from '../../../theming/theme';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';

export interface IPromotionLinkButtonStyle {
  buttonContainerViewStyle: ViewStyle;
  linkTextStyle: TextStyle;
  rowViewStyle: ViewStyle;
  promotionTextStyle: TextStyle;
  couponIconImageStyle: ImageStyle;
}

const buttonContainerViewStyle: ViewStyle = {
  backgroundColor: GreyScale.lightest,
};

const rowViewStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  backgroundColor: GreyScale.lightWhite,
  borderRadius: Spacing.threeQuarters,
  padding: Spacing.base,
};

const linkTextStyle: TextStyle = {
  fontSize: FontSize.small,
  ...getFontFace({ weight: FontWeight.semiBold }),
  color: PurpleScale.darkest,
  marginLeft: Spacing.quarter,
  textDecorationLine: 'underline',
};

const promotionTextStyle: TextStyle = {
  fontSize: FontSize.small,
  ...getFontFace({ weight: FontWeight.semiBold }),
};

const couponIconImageStyle: ImageStyle = {
  height: 19,
  width: 24,
  marginTop: 2,
  marginRight: Spacing.half,
};

export const PromotionLinkButtonStyle: IPromotionLinkButtonStyle = {
  buttonContainerViewStyle,
  linkTextStyle,
  rowViewStyle,
  promotionTextStyle,
  couponIconImageStyle,
};
