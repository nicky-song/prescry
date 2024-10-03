// Copyright 2021 Prescryptive Health, Inc.

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { FontWeight } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface ICustomerSupportStyles {
  iconImageStyle: ImageStyle;
  customerSupportContainerViewStyle: ViewStyle;
  prescryptiveHelpTextStyle: TextStyle;
  supportTextStyle: TextStyle;
  textContainerViewStyle: ViewStyle;
}

const iconImageStyle: ImageStyle = {
  marginRight: Spacing.base,
};

const customerSupportContainerViewStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  backgroundColor: GrayScaleColor.lightGray,
  padding: Spacing.base,
  borderRadius: BorderRadius.normal,
};

const prescryptiveHelpTextStyle: TextStyle = {
  fontWeight: FontWeight.semiBold,
  flexWrap: 'wrap',
};

const supportTextStyle: TextStyle = {
  marginTop: Spacing.quarter,
  flexWrap: 'wrap',
};

const textContainerViewStyle: ViewStyle = {
  flex: 1,
};

export const customerSupportStyle: ICustomerSupportStyles = {
  iconImageStyle,
  customerSupportContainerViewStyle,
  prescryptiveHelpTextStyle,
  supportTextStyle,
  textContainerViewStyle,
};
