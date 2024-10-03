// Copyright 2022 Prescryptive Health, Inc.

import { BorderRadius } from '../../../../theming/borders';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import { Spacing } from '../../../../theming/spacing';
import {
  IGreatPriceScreenStyles,
  greatPriceScreenStyles,
} from './great-price.screen.styles';

describe('greatPriceScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IGreatPriceScreenStyles = {
      descriptionTextStyle: {
        marginTop: Spacing.half,
      },
      prescribedMedicationViewStyle: {
        marginTop: Spacing.times2,
        borderRadius: BorderRadius.normal,
        borderWidth: 1,
        borderColor: GrayScaleColor.borderLines,
        padding: Spacing.base,
      },
      pricingAtPharmacyNameViewStyle: {
        marginTop: Spacing.times2,
      },
      doneButtonViewStyle: {
        backgroundColor: GrayScaleColor.white,
        borderWidth: 2,
        borderColor: PrimaryColor.darkPurple,
        marginTop: Spacing.base,
      },
      doneButtonTextStyle: {
        color: PrimaryColor.darkPurple,
      },
      prescriptionPharmacyInfoViewStyle: {
        marginTop: Spacing.times2,
      },
      customerSupportViewStyle: {
        marginTop: Spacing.times2,
      },
    };

    expect(greatPriceScreenStyles).toEqual(expectedStyles);
  });
});
