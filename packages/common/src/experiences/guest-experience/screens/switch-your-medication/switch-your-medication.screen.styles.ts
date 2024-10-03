// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import { Spacing } from '../../../../theming/spacing';

export interface ISwitchYourMedicationScreenStyles {
  switchYourMedicationContainerViewStyle: ViewStyle;
  descriptionTextStyle: TextStyle;
  headingViewStyle: ViewStyle;
  callButtonViewStyle: ViewStyle;
  actionButtonViewStyle: ViewStyle;
  actionButtonTextStyle: TextStyle;
  customerSupportViewStyle: ViewStyle;
}

export const switchYourMedicationScreenStyles: ISwitchYourMedicationScreenStyles =
  {
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
