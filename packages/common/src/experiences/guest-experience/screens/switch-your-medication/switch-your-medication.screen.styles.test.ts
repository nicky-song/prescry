// Copyright 2022 Prescryptive Health, Inc.

import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import { Spacing } from '../../../../theming/spacing';
import {
  ISwitchYourMedicationScreenStyles,
  switchYourMedicationScreenStyles,
} from './switch-your-medication.screen.styles';

describe('switchYourMedicationScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISwitchYourMedicationScreenStyles = {
      switchYourMedicationContainerViewStyle: { marginTop: Spacing.times2 },
      descriptionTextStyle: {
        marginTop: Spacing.times2,
      },
      headingViewStyle: {
        marginTop: Spacing.base,
      },
      callButtonViewStyle: {
        marginTop: Spacing.times2,
      },
      actionButtonViewStyle: {
        marginTop: Spacing.base,
        backgroundColor: GrayScaleColor.white,
        borderWidth: 2,
        borderColor: PrimaryColor.darkPurple,
      },
      actionButtonTextStyle: {
        color: PrimaryColor.darkPurple,
      },
      customerSupportViewStyle: {
        marginTop: Spacing.times2,
      },
    };

    expect(switchYourMedicationScreenStyles).toEqual(expectedStyles);
  });
});
