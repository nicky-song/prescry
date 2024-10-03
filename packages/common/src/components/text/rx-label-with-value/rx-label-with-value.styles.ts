// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';

export interface IRxLabelWithValueStyles {
  rxLabelWithValueViewStyle: ViewStyle;
  rxLabelTextStyle: TextStyle;
  rxBenefitLabelTextStyle: TextStyle;
  rxSavingsLabelTextStyle: TextStyle;
  rxValueTextStyle: TextStyle;
  rxBenefitValueTextStyle: TextStyle;
  rxSavingsValueTextStyle: TextStyle;
}

export const rxLabelWithValueStyles: IRxLabelWithValueStyles = {
  rxLabelWithValueViewStyle: {
    marginRight: Spacing.base,
  },
  rxLabelTextStyle: {
    ...getFontDimensions(FontSize.small),
    lineHeight: 14,
    marginBottom: Spacing.quarter,
  },
  rxBenefitLabelTextStyle: {
    color: GrayScaleColor.secondaryGray,
  },
  rxSavingsLabelTextStyle: {
    color: PrimaryColor.lightPurple,
  },
  rxValueTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    lineHeight: 16,
  },
  rxBenefitValueTextStyle: {
    color: PrimaryColor.darkPurple,
  },
  rxSavingsValueTextStyle: {
    color: GrayScaleColor.white,
  },
};
