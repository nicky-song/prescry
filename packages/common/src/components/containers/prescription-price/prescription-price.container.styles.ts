// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IPrescriptionPriceContainerStyles {
  viewStyle: ViewStyle;
  plainViewStyle: ViewStyle;
}

export const prescriptionPriceContainerStyles: IPrescriptionPriceContainerStyles =
  {
    viewStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: Spacing.threeQuarters,
      paddingBottom: Spacing.threeQuarters,
      paddingLeft: Spacing.base,
      paddingRight: Spacing.base,
      backgroundColor: GrayScaleColor.lightGray,
    },
    plainViewStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: Spacing.base,
      paddingBottom: Spacing.half,
    },
  };
