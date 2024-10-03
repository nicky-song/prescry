// Copyright 2023 Prescryptive Health, Inc.

import { Spacing } from '../../../../../theming/spacing';
import {
  ISmartPriceLearnMoreModalStyles,
  smartPriceLearnMoreModalStyles,
} from './smart-price.learn-more-modal.styles';

describe('smartPriceLearnMoreModalStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISmartPriceLearnMoreModalStyles = {
      headingOneTextStyle: {},
      descriptionOneTextStyle: { marginTop: Spacing.half },
      headingTwoTextStyle: { marginTop: Spacing.times1pt5 },
      descriptionTwoTextStyle: { marginTop: Spacing.half },
    };

    expect(smartPriceLearnMoreModalStyles).toEqual(expectedStyles);
  });
});
