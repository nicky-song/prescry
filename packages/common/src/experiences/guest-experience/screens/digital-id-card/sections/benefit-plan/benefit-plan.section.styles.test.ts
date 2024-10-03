// Copyright 2023 Prescryptive Health, Inc.

import { Spacing } from '../../../../../../theming/spacing';
import {
  IBenefitPlanSectionStyles,
  benefitPlanSectionStyles,
} from './benefit-plan.section.styles';

describe('benefitPlanSectionStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IBenefitPlanSectionStyles = {
      descriptionTextStyle: { marginTop: Spacing.base },
    };

    expect(benefitPlanSectionStyles).toEqual(expectedStyles);
  });
});
