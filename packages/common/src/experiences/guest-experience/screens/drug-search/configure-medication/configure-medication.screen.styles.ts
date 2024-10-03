// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../../../theming/spacing';

export interface IConfigureMedicationScreenStyles {
  quantityViewStyle: ViewStyle;
  buttonViewStyle: ViewStyle;
  toggleGroupViewStyle: ViewStyle;
  topToggleButtonViewStyle: ViewStyle;
}

export const configureMedicationScreenStyles: IConfigureMedicationScreenStyles =
  {
    quantityViewStyle: {
      width: '25%',
    },
    buttonViewStyle: { marginTop: Spacing.times2 },
    toggleGroupViewStyle: {
      marginBottom: Spacing.base,
    },
    topToggleButtonViewStyle: {
      marginTop: Spacing.base,
      marginBottom: Spacing.base,
    },
  };
