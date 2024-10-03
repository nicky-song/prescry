// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../../../theming/spacing';
import { GrayScaleColor } from '../../../../../theming/colors';
export interface IWhatComesNextScreenStyles {
  separatorViewStyle: ViewStyle;
  prescriptionAtThisPharmacyViewStyle: ViewStyle;
  prescriptionAtAnotherPharmacyViewStyle: ViewStyle;
  newPrescriptionViewStyle: ViewStyle;
  customerSupportViewStyle: ViewStyle;
  favoritingNotificationViewStyle: ViewStyle;
  bodyContentContainerTitleViewStyle: ViewStyle;
  favoriteIconButtonViewStyle: ViewStyle;
}

export const whatComesNextScreenStyles: IWhatComesNextScreenStyles = {
  separatorViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
  },
  prescriptionAtThisPharmacyViewStyle: {
    backgroundColor: GrayScaleColor.lightGray,
    marginLeft: -Spacing.times1pt5,
    marginRight: -Spacing.times1pt5,
    marginTop: Spacing.times2,
  },
  prescriptionAtAnotherPharmacyViewStyle: {
    marginTop: Spacing.times2,
  },
  newPrescriptionViewStyle: {
    marginTop: Spacing.base,
  },
  customerSupportViewStyle: {
    marginTop: Spacing.times2,
  },
  favoritingNotificationViewStyle: {
    width: '100%',
  },
  bodyContentContainerTitleViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  favoriteIconButtonViewStyle: { marginLeft: Spacing.base },
};
