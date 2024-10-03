// Copyright 2023 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../../../../../theming/spacing';

export interface IBenefitPlanSectionStyles {
  descriptionTextStyle: TextStyle;
}

export const benefitPlanSectionStyles: IBenefitPlanSectionStyles = {
  descriptionTextStyle: { marginTop: Spacing.base },
};
