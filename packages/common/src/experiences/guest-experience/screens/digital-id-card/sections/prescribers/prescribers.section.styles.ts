// Copyright 2023 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';

export interface IPrescribersSectionStyles {
  sectionViewStyle: ViewStyle;
  iconViewStyle: ViewStyle;
  labelTextStyle: TextStyle;
  bodyTextStyle: TextStyle;
  textViewStyle: ViewStyle;
}

export const prescribersSectionStyles: IPrescribersSectionStyles = {
  sectionViewStyle: { marginTop: Spacing.base, flexDirection: 'row' },
  iconViewStyle: { marginRight: Spacing.base, paddingTop: Spacing.quarter },
  labelTextStyle: { ...getFontFace({ weight: FontWeight.semiBold }) },
  bodyTextStyle: { marginTop: Spacing.half },
  textViewStyle: { flex: 1 },
};
