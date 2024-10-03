// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../theming/spacing';

export interface IInsuranceInformationStyles {
  insuranceViewStyle: TextStyle;
}

export const insuranceInformationStyles: IInsuranceInformationStyles = {
  insuranceViewStyle: {
    marginTop: Spacing.threeQuarters,
  },
};
