// Copyright 2022 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  ISwitchingMedicationContainerStyles,
  switchingMedicationContainerStyles,
} from './switching-medication.container.styles';

describe('switchingMedicationContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISwitchingMedicationContainerStyles = {
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

    expect(switchingMedicationContainerStyles).toEqual(expectedStyles);
  });
});
