// Copyright 2021 Prescryptive Health, Inc.

import { BorderRadius } from '../../../../theming/borders';
import { GrayScaleColor } from '../../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../../theming/fonts';
import { shadows } from '../../../../theming/shadows';
import { Spacing } from '../../../../theming/spacing';

import {
  IUnauthSmartPriceCardStyles,
  unauthSmartPriceCardStyles,
} from './unauth-smart-price.card.styles';

describe('unauthSmartPriceCardStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IUnauthSmartPriceCardStyles = {
      labelTextStyle: {
        ...getFontDimensions(FontSize.small),
      },

      containerViewStyle: {
        backgroundColor: GrayScaleColor.white,
        borderRadius: BorderRadius.times1pt5,
        ...shadows.cardShadowStyle,
      },

      headerViewStyle: {
        borderTopLeftRadius: BorderRadius.times1pt5,
        borderTopRightRadius: BorderRadius.times1pt5,
        height: 56,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: Spacing.base,
        paddingRight: Spacing.base,
        paddingTop: Spacing.base,
        paddingBottom: Spacing.base,
      },

      brandImage: {
        width: 72,
        height: '100%',
        flexGrow: 0,
      },

      brandMyPrescryptiveImage: {
        width: 125,
        height: 50,
        marginTop: Spacing.base,
      },

      topRowViewStyle: {
        paddingBottom: Spacing.base,
        flexDirection: 'column',
      },

      paddingStyle: { padding: Spacing.base },

      lastRowViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },

      dataViewStyle: { flex: 1, alignItems: 'center' },

      firstItemViewStyle: {
        flex: 1,
      },

      contentTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        ...getFontDimensions(FontSize.small),
      },
    };

    expect(unauthSmartPriceCardStyles).toEqual(expectedStyles);
  });
});
