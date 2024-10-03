// Copyright 2023 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  IPricingOptionContextContainerStyles,
  pricingOptionContextContainerStyles,
} from './pricing-option-context.container.styles';

describe('pricingOptionContextContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPricingOptionContextContainerStyles = {
      prescpritionTitleViewStyle: {
        marginBottom: Spacing.times1pt25,
      },
    };

    expect(pricingOptionContextContainerStyles).toEqual(expectedStyles);
  });
});
