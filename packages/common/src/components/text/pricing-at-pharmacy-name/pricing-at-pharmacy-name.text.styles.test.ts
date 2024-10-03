// Copyright 2022 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IPricingAtPharmacyNameTextStyles,
  pricingAtPharmacyNameTextStyles,
} from './pricing-at-pharmacy-name.text.styles';

describe('pricingAtPharmacyNameTextStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPricingAtPharmacyNameTextStyles = {
      textStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      pricingAtPharmacyNameViewStyles: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: Spacing.times2,
        flex: 1,
      },
    };

    expect(pricingAtPharmacyNameTextStyles).toEqual(expectedStyles);
  });
});
