// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import { Spacing } from '../../../../theming/spacing';

export interface IPrescriptionPersonScreenStyles {
  buttonViewStyle: ViewStyle;
  buttonTextStyle: TextStyle;
}

const buttonViewStyle: ViewStyle = {
  backgroundColor: GrayScaleColor.white,
  borderColor: PrimaryColor.darkPurple,
  borderWidth: 2,
  marginTop: Spacing.base,
};

const buttonTextStyle: TextStyle = {
  color: PrimaryColor.darkPurple,
};

export const prescriptionPersonScreenStyles: IPrescriptionPersonScreenStyles = {
  buttonViewStyle,
  buttonTextStyle,
};
