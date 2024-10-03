// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { GreyScale, FontSize } from '../../../theming/theme';
import { Spacing } from '../../../theming/spacing';
import { FontWeight, getFontFace } from '../../../theming/fonts';

export interface ISmartPriceScreenStyle {
  sectionViewStyle: ViewStyle;
  cardViewStyle: ViewStyle;
  sectionTitleTextStyle: TextStyle;
  sectionContentTextStyle: TextStyle;
  manageMyInformationTextStyle: TextStyle;
  buttonContainer: ViewStyle;
  editIcon: ImageStyle;
  manageInfoSectionViewStyle: ViewStyle;
}

const sectionViewStyle: ViewStyle = {
  borderBottomWidth: 1,
  borderBottomColor: GreyScale.light,
  marginBottom: Spacing.times1pt5,
};

const cardViewStyle: ViewStyle = {
  marginBottom: Spacing.times1pt5,
};

const sectionTitleTextStyle: TextStyle = {
  color: GreyScale.darkest,
  fontSize: FontSize.larger,
  ...getFontFace({ weight: FontWeight.bold }),
  textAlign: 'left',
  marginBottom: Spacing.threeQuarters,
};

const sectionContentTextStyle: TextStyle = {
  color: GreyScale.darkest,
  fontSize: FontSize.small,
};

const manageMyInformationTextStyle: TextStyle = {
  ...sectionTitleTextStyle,
  marginBottom: Spacing.times1pt5,
  flexBasis: 'auto',
  ...getFontFace({ weight: FontWeight.semiBold }),
};

const buttonContainer: ViewStyle = {
  alignItems: 'flex-end',
  marginRight: Spacing.half,
  alignSelf: 'flex-start',
};

const editIcon: ImageStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
};

const manageInfoSectionViewStyle: ViewStyle = {
  ...sectionViewStyle,
  flexDirection: 'row',
  justifyContent: 'space-between',
};

export const smartPriceScreenStyle: ISmartPriceScreenStyle = {
  sectionViewStyle,
  cardViewStyle,
  sectionTitleTextStyle,
  sectionContentTextStyle,
  manageMyInformationTextStyle,
  buttonContainer,
  editIcon,
  manageInfoSectionViewStyle,
};
