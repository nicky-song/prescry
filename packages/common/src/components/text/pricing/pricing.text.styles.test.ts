// Copyright 2022 Prescryptive Health, Inc.

import { GrayScaleColor } from '../../../theming/colors';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { IPricingTextStyles, pricingTextStyles } from './pricing.text.styles';

describe('pricingTextStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPricingTextStyles = {
      planPaysViewStyle: {
        backgroundColor: GrayScaleColor.white,
        justifyContent: 'flex-start',
      },
      detailsMemberPaysPricingTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      detailsViewStyle: {
        paddingTop: Spacing.quarter,
        paddingBottom: Spacing.quarter,
      },
      wideViewStyle: {
        marginLeft: -Spacing.base,
        marginRight: -Spacing.base,
      },
      planPaysTextStyle: { fontSize: FontSize.small },
    };

    expect(pricingTextStyles).toEqual(expectedStyles);
  });
});
