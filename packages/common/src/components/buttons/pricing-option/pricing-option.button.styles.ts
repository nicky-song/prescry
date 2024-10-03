// Copyright 2023 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';

export interface IPricingOptionButtonStyles {
  rowViewStyle: ViewStyle;
  rowViewActiveStyle: ViewStyle;
  rowViewInactiveStyle: ViewStyle;
  titleTextStyle: TextStyle;
  subTextStyle: ViewStyle;
  titleContainerViewStyle: ViewStyle;
  priceTextStyle: TextStyle;
}

export const pricingOptionButtonStyle: IPricingOptionButtonStyles = {
  titleContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  rowViewActiveStyle: {
    backgroundColor: PrimaryColor.lightPurple,
    borderWidth: 2,
    borderColor: PrimaryColor.prescryptivePurple,
  },

  rowViewInactiveStyle: {
    borderWidth: 1,
    borderColor: GrayScaleColor.borderLines,
  },

  rowViewStyle: {
    padding: Spacing.base,
    borderRadius: BorderRadius.normal,
  },

  titleTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    marginBottom: Spacing.quarter,
  },

  priceTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    textAlign: 'right',
    flex: 2,
  },

  subTextStyle: {
    ...getFontDimensions(FontSize.small),
  },
};
