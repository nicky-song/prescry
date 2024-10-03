// Copyright 2022 Prescryptive Health, Inc.

import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IRxLabelWithValueStyles,
  rxLabelWithValueStyles,
} from './rx-label-with-value.styles';

describe('rxLabelWithValueStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IRxLabelWithValueStyles = {
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

    expect(rxLabelWithValueStyles).toEqual(expectedStyles);
  });
});
