// Copyright 2023 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../../../../theming/spacing';

export interface ISmartPriceLearnMoreModalStyles {
  headingOneTextStyle: TextStyle;
  descriptionOneTextStyle: TextStyle;
  headingTwoTextStyle: TextStyle;
  descriptionTwoTextStyle: TextStyle;
}

export const smartPriceLearnMoreModalStyles: ISmartPriceLearnMoreModalStyles = {
  headingOneTextStyle: {},
  descriptionOneTextStyle: { marginTop: Spacing.half },
  headingTwoTextStyle: { marginTop: Spacing.times1pt5 },
  descriptionTwoTextStyle: { marginTop: Spacing.half },
};
