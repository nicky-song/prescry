// Copyright 2023 Prescryptive Health, Inc.

import { Spacing } from '../../../../../theming/spacing';
import {
  benefitPlanLearnMoreModalStyles,
  IBenefitPlanLearnMoreModalStyles,
} from './benefit-plan.learn-more-modal.styles';

describe('benefitPlanLearnMoreModalStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IBenefitPlanLearnMoreModalStyles = {
      descriptionTextStyle: {
        marginTop: Spacing.half,
      },
    };

    expect(benefitPlanLearnMoreModalStyles).toEqual(expectedStyles);
  });
});
