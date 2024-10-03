// Copyright 2023 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import {
  healthPlanScreenStyles,
  IHealthPlanScreenStyles,
} from './health-plan.screen.styles';

describe('healthPlanScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IHealthPlanScreenStyles = {
      headingTextStyle: {
        marginLeft: Spacing.times1pt5,
      },
      rxCardCarouselViewStyle: {
        marginTop: Spacing.times2,
        marginBottom: Spacing.times2,
        marginLeft: Spacing.times1pt5,
        marginRight: Spacing.times1pt5,
      },
      viewPlanAccumulatorsSectionViewStyle: {
        marginTop: Spacing.times2,
        marginLeft: Spacing.times1pt5,
        marginRight: Spacing.times1pt5,
      },
      viewPlanAccumulatorsTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      lineSeparatorOneViewStyle: {
        marginTop: Spacing.times2,
      },
      lineSeparatorTwoViewStyle: {
        marginTop: Spacing.times2,
      },
      lineSeparatorThreeViewStyle: {
        marginTop: Spacing.times2,
        marginLeft: Spacing.times1pt5,
        marginRight: Spacing.times1pt5,
      },
      prescribersSectionViewStyle: {
        marginTop: Spacing.times2,
        marginLeft: Spacing.times1pt5,
        marginRight: Spacing.times1pt5,
      },
      pharmaciesSectionViewStyle: {
        marginTop: Spacing.times1pt5,
        marginLeft: Spacing.times1pt5,
        marginRight: Spacing.times1pt5,
      },
      customerSupportViewStyle: {
        marginTop: Spacing.times1pt5,
        marginLeft: Spacing.times1pt5,
        marginRight: Spacing.times1pt5,
        marginBottom: Spacing.times1pt5,
      },
      sectionViewStyle: {
        marginLeft: Spacing.times1pt5,
        marginRight: Spacing.times1pt5,
      },
    };

    expect(healthPlanScreenStyles).toEqual(expectedStyles);
  });
});
