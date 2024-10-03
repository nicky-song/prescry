// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IClaimPharmacyInfoStyles {
  iconTextStyle: TextStyle;
  rowViewStyle: ViewStyle;
  titleTextStyle: TextStyle;
  favoriteIconButtonViewStyle: ViewStyle;
}

export const claimPharmacyInfoStyles: IClaimPharmacyInfoStyles = {
  rowViewStyle: {
    flexDirection: 'row',
    marginBottom: Spacing.threeQuarters,
    alignItems: 'center',
  },
  iconTextStyle: {
    marginRight: Spacing.threeQuarters,
    color: PrimaryColor.darkBlue,
  },
  titleTextStyle: {
    marginBottom: Spacing.half,
  },
  favoriteIconButtonViewStyle: {
    marginLeft: Spacing.base,
    marginBottom: Spacing.half,
  },
};
