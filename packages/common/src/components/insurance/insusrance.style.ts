// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../theming/spacing';

export interface IInsuranceStyles {
  insuranceViewStyle: TextStyle;
}

export const insuranceStyles: IInsuranceStyles = {
  insuranceViewStyle: {
    marginTop: Spacing.threeQuarters,
  },
};
