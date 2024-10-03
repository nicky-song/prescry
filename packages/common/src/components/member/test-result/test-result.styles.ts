// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface ITestResultStyles {
  providerNameTextStyle: TextStyle;
  instructionsTextStyle: TextStyle;
  moreInfoTextStyle: TextStyle;
  firstMoreInfoTextStyle: TextStyle;
  separatorViewStyle: ViewStyle;
  toolButtonIconTextStyle: TextStyle;
  toolButtonViewStyle: ViewStyle;
  spinnerViewStyle: ViewStyle;
  allowPopUpsTextStyle: TextStyle;
}

export const testResultStyles: ITestResultStyles = {
  providerNameTextStyle: {
    ...getFontFace({ weight: FontWeight.bold }),
  },
  instructionsTextStyle: {
    fontSize: FontSize.small,
  },
  moreInfoTextStyle: {
    marginTop: Spacing.threeQuarters,
  },
  firstMoreInfoTextStyle: {
    marginTop: 0,
  },
  separatorViewStyle: {
    marginTop: Spacing.times1pt5,
    marginBottom: Spacing.times1pt5,
  },
  toolButtonIconTextStyle: { fontSize: FontSize.xLarge },
  toolButtonViewStyle: { marginBottom: Spacing.base },
  spinnerViewStyle: { marginBottom: Spacing.base },
  allowPopUpsTextStyle: {
    fontSize: FontSize.small,
    marginBottom: Spacing.threeQuarters,
  },
};
