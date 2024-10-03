// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IPrescriptionListStyles {
  titleTextStyle: TextStyle;
  prescriptionCardViewStyle: ViewStyle;
  prescriptionCardFirstViewStyle: ViewStyle;
}

export const prescriptionListStyles: IPrescriptionListStyles = {
  titleTextStyle: {
    marginBottom: Spacing.times2,
  },
  prescriptionCardViewStyle: {
    marginTop: Spacing.times1pt25,
  },
  prescriptionCardFirstViewStyle: {},
};
