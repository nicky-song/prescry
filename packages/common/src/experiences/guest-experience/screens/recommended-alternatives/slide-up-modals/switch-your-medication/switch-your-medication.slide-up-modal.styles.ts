// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../../../../../theming/spacing';

export interface ISwitchYourMedicationSlideUpModalStyles {
  descriptionTextStyle: TextStyle;
  genericsHeadingTextStyle: TextStyle;
  genericsDescriptionTextStyle: TextStyle;
  therapeuticAlternativesHeadingTextStyle: TextStyle;
  therapeuticAlternativesDescriptionTextStyle: TextStyle;
  discretionaryAlternativesHeadingTextStyle: TextStyle;
}

export const switchYourMedicationSlideUpModalStyles: ISwitchYourMedicationSlideUpModalStyles =
  {
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
