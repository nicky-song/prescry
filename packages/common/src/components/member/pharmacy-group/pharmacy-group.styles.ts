// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IPharmacyGroupStyles {
  pharmacyGroupViewStyle: ViewStyle;
  pharmacyInfoCardParentViewStyle: ViewStyle;
  pharmacyInfoCardViewStyle: ViewStyle;
  lineSeparatorViewStyle: ViewStyle;
}

export const pharmacyGroupStyles: IPharmacyGroupStyles = {
  pharmacyGroupViewStyle: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  pharmacyInfoCardParentViewStyle: {
    width: '100%',
    marginTop: Spacing.threeQuarters,
    paddingLeft: Spacing.times2,
  },
  lineSeparatorViewStyle: {
    marginTop: Spacing.threeQuarters,
    marginRight: Spacing.times2,
  },
  pharmacyInfoCardViewStyle: { marginVertical: Spacing.base },
};
