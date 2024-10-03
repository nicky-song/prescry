// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../../theming/borders';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import { Spacing } from '../../../../theming/spacing';

export interface IGreatPriceScreenStyles {
  descriptionTextStyle: TextStyle;
  prescribedMedicationViewStyle: ViewStyle;
  pricingAtPharmacyNameViewStyle: ViewStyle;
  doneButtonViewStyle: ViewStyle;
  doneButtonTextStyle: TextStyle;
  prescriptionPharmacyInfoViewStyle: ViewStyle;
  customerSupportViewStyle: ViewStyle;
}

export const greatPriceScreenStyles: IGreatPriceScreenStyles = {
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
