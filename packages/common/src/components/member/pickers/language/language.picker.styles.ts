// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import {
  getFontDimensions,
  FontSize,
  FontWeight,
  getFontFace,
} from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface ILanguagePickerStyles {
  pickerTextStyle: TextStyle;
}

const pickerTextStyle: TextStyle = {
  flex: 1,
  flexDirection: 'row',
  ...getFontFace({ weight: FontWeight.semiBold }),
  ...getFontDimensions(FontSize.small),
  color: GrayScaleColor.lightGray,
  borderColor: PrimaryColor.prescryptivePurple,
  backgroundColor: PrimaryColor.prescryptivePurple,
  padding: Spacing.quarter,
  maxWidth: 98,
};

export const languagePickerStyles: ILanguagePickerStyles = {
  pickerTextStyle,
};
