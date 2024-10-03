// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IPharmacyTextStyles {
  descriptionTextStyle: TextStyle;
  parentViewStyle: ViewStyle;
  headingViewStyle: ViewStyle;
  favoriteIconButtonViewStyle: ViewStyle;
}

export const pharmacyTextStyles: IPharmacyTextStyles = {
  descriptionTextStyle: {
    marginTop: Spacing.threeQuarters,
  },
  parentViewStyle: {
    marginBottom: 0,
  },
  headingViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: Spacing.threeQuarters,
  },
  favoriteIconButtonViewStyle: { marginLeft: Spacing.base },
};
