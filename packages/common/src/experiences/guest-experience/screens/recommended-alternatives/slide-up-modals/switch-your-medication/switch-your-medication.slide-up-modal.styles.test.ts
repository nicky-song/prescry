// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../../../../theming/spacing';
import {
  ISwitchYourMedicationSlideUpModalStyles,
  switchYourMedicationSlideUpModalStyles,
} from './switch-your-medication.slide-up-modal.styles';

describe('switchYourMedicationSlideUpModalStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISwitchYourMedicationSlideUpModalStyles = {
      descriptionTextStyle: { marginBottom: Spacing.times2 },
      genericsHeadingTextStyle: {
        marginBottom: Spacing.half,
      },
      genericsDescriptionTextStyle: { marginBottom: Spacing.times2 },
      therapeuticAlternativesHeadingTextStyle: {
        marginBottom: Spacing.half,
      },
      therapeuticAlternativesDescriptionTextStyle: {
        marginBottom: Spacing.times2,
      },
      discretionaryAlternativesHeadingTextStyle: {
        marginBottom: Spacing.half,
      },
    };

    expect(switchYourMedicationSlideUpModalStyles).toEqual(expectedStyles);
  });
});
