// Copyright 2022 Prescryptive Health, Inc.

import { StyleProp, TextStyle } from 'react-native';
import { BorderRadius } from '../../../../theming/borders';
import { GrayScaleColor } from '../../../../theming/colors';
import {
  getFontDimensions,
  getFontFace,
  FontSize,
} from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface IBasePickerStyles {
  pickerTextStyle: StyleProp<TextStyle>;
}

export const basePickerStyles: IBasePickerStyles = {
  pickerTextStyle: {
    color: GrayScaleColor.primaryText,
    borderColor: GrayScaleColor.borderLines,
    backgroundColor: GrayScaleColor.white,
    borderRadius: BorderRadius.normal,
    borderWidth: 1,
    padding: Spacing.threeQuarters,
    height: 48,
    ...getFontFace(),
    ...getFontDimensions(FontSize.body),
  },
};
