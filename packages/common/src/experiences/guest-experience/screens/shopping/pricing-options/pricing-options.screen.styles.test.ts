// Copyright 2023 Prescryptive Health, Inc.

import { Spacing } from '../../../../../theming/spacing';
import {
  IPricingOptionsScreenStyles,
  pricingOptionsScreenStyles,
} from './pricing-options.screen.styles';

describe('pricingOptionsScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyle: IPricingOptionsScreenStyles = {
      separatorViewStyle: {
        marginTop: Spacing.times2,
        marginBottom: Spacing.times1pt5,
      },
      selectYourPricingOptionViewStyle: {
        flexDirection: 'row',
        alignItems: 'baseline',
      },
      pricingOptionGroupViewStyle: {
        marginTop: Spacing.times1pt5,
      },
    };
    expect(pricingOptionsScreenStyles).toEqual(expectedStyle);
  });
});
