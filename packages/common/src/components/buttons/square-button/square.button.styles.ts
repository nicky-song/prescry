// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { PrimaryColor, GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface ISquareButtonStyles {
  enabledPrimaryViewStyle: ViewStyle;
  disabledPrimaryViewStyle: ViewStyle;
  enabledPrimaryTextStyle: TextStyle;
  disabledPrimaryTextStyle: TextStyle;
  enabledSecondaryTextStyle: TextStyle;
  disabledSecondaryTextStyle: TextStyle;
  enabledSecondaryViewStyle: ViewStyle;
  disabledSecondaryViewStyle: ViewStyle;
}

const commonTextStyle: TextStyle = {
  color: GrayScaleColor.white,
};

const commonViewStyle: ViewStyle = {
  borderRadius: BorderRadius.half,
  paddingRight: Spacing.base,
  paddingLeft: Spacing.base,
  maxWidth: 'fit-content',
};

const commonSecondaryViewStyle: ViewStyle = {
  ...commonViewStyle,
  borderWidth: 1,
  backgroundColor: 'transparent',
};

export const squareButtonStyles: ISquareButtonStyles = {
  enabledPrimaryViewStyle: {
    ...commonViewStyle,
    backgroundColor: PrimaryColor.darkBlue,
  },
  disabledPrimaryViewStyle: {
    ...commonViewStyle,
    backgroundColor: GrayScaleColor.disabledGray,
  },
  enabledSecondaryViewStyle: {
    ...commonSecondaryViewStyle,
    borderColor: PrimaryColor.darkBlue,
  },
  disabledSecondaryViewStyle: {
    ...commonSecondaryViewStyle,
    borderColor: GrayScaleColor.disabledGray,
  },
  enabledSecondaryTextStyle: { color: PrimaryColor.darkBlue },
  disabledSecondaryTextStyle: { color: GrayScaleColor.disabledGray },
  enabledPrimaryTextStyle: commonTextStyle,
  disabledPrimaryTextStyle: commonTextStyle,
};
