// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { PrimaryColor, GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface ISecondaryButtonStyles {
  enabledLargeViewStyle: ViewStyle;
  disabledLargeViewStyle: ViewStyle;
  enabledLargeTextStyle: TextStyle;
  disabledLargeTextStyle: TextStyle;
  enabledMediumViewStyle: ViewStyle;
  disabledMediumViewStyle: ViewStyle;
  enabledMediumTextStyle: TextStyle;
  disabledMediumTextStyle: TextStyle;
}

const commonViewStyle: ViewStyle = {
  backgroundColor: GrayScaleColor.white,
};

const borderWidthLarge = 2;
const borderWidthMedium = 1;
const paddingHorizontalLarge = 56; // TODO: Figma designs say 56 but then don't include 56 in spacing definitions

const commonLargeViewStyle: ViewStyle = {
  ...commonViewStyle,
  borderWidth: borderWidthLarge,
  paddingTop: Spacing.base - borderWidthLarge,
  paddingBottom: Spacing.base - borderWidthLarge,
  paddingRight: paddingHorizontalLarge - borderWidthLarge,
  paddingLeft: paddingHorizontalLarge - borderWidthLarge,
};

const commonMediumViewStyle: ViewStyle = {
  ...commonViewStyle,
  borderWidth: borderWidthMedium,
  paddingTop: Spacing.half - borderWidthMedium,
  paddingBottom: Spacing.half - borderWidthMedium,
  paddingRight: Spacing.times2 - borderWidthMedium,
  paddingLeft: Spacing.times2 - borderWidthMedium,
};

export const secondaryButtonStyles: ISecondaryButtonStyles = {
  enabledLargeViewStyle: {
    ...commonLargeViewStyle,
    borderColor: PrimaryColor.darkPurple,
  },
  disabledLargeViewStyle: {
    ...commonLargeViewStyle,
    borderColor: GrayScaleColor.disabledGray,
  },
  enabledMediumViewStyle: {
    ...commonMediumViewStyle,
    borderColor: PrimaryColor.darkBlue,
  },
  disabledMediumViewStyle: {
    ...commonMediumViewStyle,
    borderColor: GrayScaleColor.disabledGray,
  },
  enabledLargeTextStyle: {
    color: PrimaryColor.darkPurple,
  },
  disabledLargeTextStyle: {
    color: GrayScaleColor.disabledGray,
  },
  enabledMediumTextStyle: {
    color: PrimaryColor.darkBlue,
  },
  disabledMediumTextStyle: {
    color: GrayScaleColor.disabledGray,
  },
};
