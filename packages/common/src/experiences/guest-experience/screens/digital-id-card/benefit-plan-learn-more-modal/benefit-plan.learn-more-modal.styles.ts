// Copyright 2023 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../../../../theming/spacing';

export interface IBenefitPlanLearnMoreModalStyles {
  descriptionTextStyle: TextStyle;
}

export const benefitPlanLearnMoreModalStyles: IBenefitPlanLearnMoreModalStyles =
  {
    descriptionTextStyle: {
      marginTop: Spacing.half,
    },
  };
