// Copyright 2023 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import {
  claimReversalSlideUpModalStyles,
  IClaimReversalSlideUpModalStyles,
} from './claim-reversal.slide-up-modal.styles';

describe('claimReversalSlideUpModalStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IClaimReversalSlideUpModalStyles = {
      headingOneTextStyle: { marginBottom: Spacing.half },
      descriptionOneTextStyle: { marginBottom: Spacing.times1pt5 },
      headingTwoTextStyle: { marginBottom: Spacing.half },
      descriptionTwoTextStyle: { marginBottom: Spacing.times1pt5 },
      headingThreeTextStyle: { marginBottom: Spacing.half },
      descriptionThreeTextStyle: { marginBottom: Spacing.times2 },
    };

    expect(claimReversalSlideUpModalStyles).toEqual(expectedStyles);
  });
});
