// Copyright 2023 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  IPricingOptionGroupStyles,
  pricingOptionGroupStyle,
} from './pricing-option-group.styles';

describe('pricingOptionGroupStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IPricingOptionGroupStyles = {
      defaultViewStyle: {
        marginBottom: Spacing.base,
      },
    };

    expect(pricingOptionGroupStyle).toEqual(expectedStyles);
  });
});
