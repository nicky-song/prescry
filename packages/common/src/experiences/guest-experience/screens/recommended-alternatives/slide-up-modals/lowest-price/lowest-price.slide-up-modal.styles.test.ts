// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../../../../theming/spacing';
import {
  ILowestPriceSlideUpModalStyles,
  lowestPriceSlideUpModalStyles,
} from './lowest-price.slide-up-modal.styles';

describe('lowestPriceSlideUpModalStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ILowestPriceSlideUpModalStyles = {
      descriptionTextStyle: {
        marginBottom: Spacing.times2,
      },
      claimPharmacyInfoViewStyle: {
        marginBottom: Spacing.half,
      },
    };

    expect(lowestPriceSlideUpModalStyles).toEqual(expectedStyles);
  });
});
