// Copyright 2023 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';

export interface IClaimReversalSlideUpModalStyles {
  headingOneTextStyle: TextStyle;
  descriptionOneTextStyle: TextStyle;
  headingTwoTextStyle: TextStyle;
  descriptionTwoTextStyle: TextStyle;
  headingThreeTextStyle: TextStyle;
  descriptionThreeTextStyle: TextStyle;
}

export const claimReversalSlideUpModalStyles: IClaimReversalSlideUpModalStyles =
  {
    headingOneTextStyle: { marginBottom: Spacing.half },
    descriptionOneTextStyle: { marginBottom: Spacing.times1pt5 },
    headingTwoTextStyle: { marginBottom: Spacing.half },
    descriptionTwoTextStyle: { marginBottom: Spacing.times1pt5 },
    headingThreeTextStyle: { marginBottom: Spacing.half },
    descriptionThreeTextStyle: { marginBottom: Spacing.times2 },
  };
