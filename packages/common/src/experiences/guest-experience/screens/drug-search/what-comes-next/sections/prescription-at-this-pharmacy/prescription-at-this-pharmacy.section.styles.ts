// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../../../../theming/spacing';
import { FontSize } from '../../../../../../../theming/theme';

export interface IPrescriptionAtThisPharmacySectionStyles {
  headingTextStyle: TextStyle;
  buttonViewStyle: ViewStyle;
  smartPriceCardViewStyle: ViewStyle;
  informationTextStyle: TextStyle;
  paddingViewStyle: ViewStyle;
  rxIdCardViewStyle: ViewStyle;
}

export const prescriptionAtThisPharmacySectionStyles: IPrescriptionAtThisPharmacySectionStyles =
  {
    headingTextStyle: {
      marginBottom: Spacing.threeQuarters,
    },
    buttonViewStyle: {
      marginTop: Spacing.times1pt5,
      alignSelf: 'center',
    },
    smartPriceCardViewStyle: {
      marginTop: Spacing.base,
      marginBottom: Spacing.base,
    },
    informationTextStyle: {
      fontSize: FontSize.small,
      alignSelf: 'center',
    },
    paddingViewStyle: {
      paddingRight: Spacing.times1pt5,
      paddingLeft: Spacing.times1pt5,
      paddingBottom: Spacing.times1pt5,
      paddingTop: Spacing.times1pt5,
    },
    rxIdCardViewStyle: { marginTop: Spacing.base, marginBottom: Spacing.base },
  };
