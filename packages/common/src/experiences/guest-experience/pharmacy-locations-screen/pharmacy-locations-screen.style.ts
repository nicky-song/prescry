// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { FontSize, GreyScale } from '../../../theming/theme';

export interface IPharmacyLocationsScreenStyle {
  pharmacyLocationsHeaderTextStyle: TextStyle;
  pharmacyLocationsScreenHeaderViewStyle: ViewStyle;
}

export const pharmacyLocationsScreenStyle: IPharmacyLocationsScreenStyle = {
  pharmacyLocationsHeaderTextStyle: {
    color: GreyScale.darkest,
    fontSize: FontSize.ultra,
    ...getFontFace({ weight: FontWeight.bold }),
    textAlign: 'left',
    margin: Spacing.times1pt5,
  },
  pharmacyLocationsScreenHeaderViewStyle: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    flexGrow: 0,
  },
};
