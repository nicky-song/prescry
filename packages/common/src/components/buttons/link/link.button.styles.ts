// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface ILinkButtonStyles {
  baseTextStyle: TextStyle;
  enabledTextStyle: TextStyle;
  disabledTextStyle: TextStyle;
  baseViewStyle: ViewStyle;
}

export const linkButtonStyles: ILinkButtonStyles = {
  baseTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    borderBottomWidth: 2,
  },
  enabledTextStyle: {
    color: PrimaryColor.prescryptivePurple,
    borderBottomColor: PrimaryColor.prescryptivePurple,
  },
  disabledTextStyle: {
    color: GrayScaleColor.disabledGray,
    borderBottomColor: GrayScaleColor.disabledGray,
  },
  baseViewStyle: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
  },
};
