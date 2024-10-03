// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface ISwitchingMedicationContainerStyles {
  viewStyle: ViewStyle;
  lineSeparatorViewStyle: ViewStyle;
  prescriptionDetailsViewStyle: ViewStyle;
}

export const switchingMedicationContainerStyles: ISwitchingMedicationContainerStyles =
  {
    viewStyle: {
      borderWidth: 1,
      borderRadius: BorderRadius.normal,
      borderColor: GrayScaleColor.borderLines,
      padding: Spacing.base,
    },
    lineSeparatorViewStyle: {
      marginTop: Spacing.base,
    },
    prescriptionDetailsViewStyle: {
      marginTop: Spacing.times1pt5,
    },
  };
