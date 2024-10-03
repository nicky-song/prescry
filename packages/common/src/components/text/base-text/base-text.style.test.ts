// Copyright 2021 Prescryptive Health, Inc.

import { GrayScaleColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { FontSize as LegacyFontSize } from '../../../theming/theme';
import { baseTextStyle, IBaseTextStyle } from './base-text.style';

describe('baseTextStyle', () => {
  it('has expected styles', () => {
    const expectedStyle: IBaseTextStyle = {
      commonBaseTextStyle: {
        ...getFontFace(),
        color: GrayScaleColor.primaryText,
      },
      smallSizeTextStyle: {
        ...getFontDimensions(FontSize.small),
      },
      defaultSizeTextStyle: {
        ...getFontDimensions(FontSize.body),
      },
      largeSizeTextStyle: {
        ...getFontDimensions(LegacyFontSize.mega),
      },
      extraLargeSizeTextStyle: {
        ...getFontDimensions(LegacyFontSize.ultraLarge),
      },
      regularWeightTextStyle: {
        ...getFontFace({ weight: FontWeight.regular }),
      },
      mediumWeightTextStyle: {
        ...getFontFace({ weight: FontWeight.medium }),
      },
      semiBoldWeightTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      boldWeightTextStyle: {
        ...getFontFace({ weight: FontWeight.bold }),
      },
    };

    expect(baseTextStyle).toEqual(expectedStyle);
  });
});
