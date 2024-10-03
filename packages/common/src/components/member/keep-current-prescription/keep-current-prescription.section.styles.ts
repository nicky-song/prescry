// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IKeepCurrentPrescriptionSectionStyles {
  headingTextStyle: TextStyle;
  descriptionTextStyle: TextStyle;
  pharmacyHoursContainerViewStyle: TextStyle;
  keepCurrentPrescriptionButtonViewStyle: ViewStyle;
  keepCurrentPrescriptionButtonTextStyle: TextStyle;
}

export const keepCurrentPrescriptionSectionStyles: IKeepCurrentPrescriptionSectionStyles =
  {
    headingTextStyle: { marginBottom: Spacing.base },
    descriptionTextStyle: { marginBottom: Spacing.times1pt5 },
    pharmacyHoursContainerViewStyle: {
      marginBottom: Spacing.base,
    },
    keepCurrentPrescriptionButtonViewStyle: {
      backgroundColor: GrayScaleColor.white,
      borderColor: PrimaryColor.darkPurple,
      borderWidth: 2,
    },
    keepCurrentPrescriptionButtonTextStyle: {
      color: PrimaryColor.darkPurple,
      textAlign: 'center',
    },
  };
