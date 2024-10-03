// Copyright 2023 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IPricingOptionButtonStyles,
  pricingOptionButtonStyle,
} from './pricing-option.button.styles';

describe('pricingOptionButtonStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IPricingOptionButtonStyles = {
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

    expect(pricingOptionButtonStyle).toEqual(expectedStyles);
  });
});
