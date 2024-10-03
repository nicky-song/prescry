// Copyright 2022 Prescryptive Health, Inc.

import { BorderRadius } from '../../../../theming/borders';
import { GrayScaleColor } from '../../../../theming/colors';
import {
  FontSize,
  getFontDimensions,
  getFontFace,
} from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import { basePickerStyles, IBasePickerStyles } from './base.picker.styles';

describe('basePickerStyles', () => {
  it('has expected default styles', () => {
    const expectedStyles: IBasePickerStyles = {
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
    expect(basePickerStyles).toEqual(expectedStyles);
  });
});
