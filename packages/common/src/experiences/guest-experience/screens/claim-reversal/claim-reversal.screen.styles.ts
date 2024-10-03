// Copyright 2023 Prescryptive Health, Inc.

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface IClaimReversalScreenStyles {
  bodyViewStyle: ViewStyle;
  topViewStyle: ViewStyle;
  claimReversalImageStyle: ImageStyle;
  descriptionWrapperTextStyle: TextStyle;
  pharmacyNameTextStyle: TextStyle;
  learnMoreTextStyle: TextStyle;
  phoneButtonViewStyle: ViewStyle;
  phoneIconViewStyle: ViewStyle;
  homeButtonViewStyle: ViewStyle;
  homeButtonTextStyle: TextStyle;
  basicPageBodyViewStyle: ViewStyle;
}

export const claimReversalScreenStyles: IClaimReversalScreenStyles = {
  bodyViewStyle: {
    padding: 24,
  },
  topViewStyle: { alignItems: 'center', marginBottom: 16 },
  claimReversalImageStyle: {
    height: 83,
    width: 83,
    maxWidth: 83,
    marginBottom: Spacing.times2,
  },
  descriptionWrapperTextStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
  },
  pharmacyNameTextStyle: { ...getFontFace({ weight: FontWeight.semiBold }) },
  learnMoreTextStyle: {
    marginBottom: Spacing.times2,
  },
  phoneButtonViewStyle: { marginBottom: Spacing.base },
  phoneIconViewStyle: { marginRight: Spacing.half },
  homeButtonViewStyle: {
    backgroundColor: GrayScaleColor.white,
    borderWidth: 2,
    borderColor: PrimaryColor.darkPurple,
    marginBottom: Spacing.half,
  },
  homeButtonTextStyle: {
    color: PrimaryColor.darkPurple,
  },
  basicPageBodyViewStyle: {
    height: '100%',
  },
};
