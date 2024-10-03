// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface IPharmacyInfoCardStyles {
  contentViewStyle: ViewStyle;
  pharmacyTagListViewStyle: ViewStyle;
  chevronCardViewStyle: ViewStyle;
  pharmacyInfoViewStyle: ViewStyle;
  addressTextStyle: TextStyle;
}

export const pharmacyInfoCardStyles: IPharmacyInfoCardStyles = {
  contentViewStyle: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    width: '100%',
  },
  pharmacyTagListViewStyle: {
    marginBottom: Spacing.base,
  },
  chevronCardViewStyle: {
    width: '100%',
  },
  pharmacyInfoViewStyle: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  addressTextStyle: {
    ...getFontFace({ weight: FontWeight.bold }),
    marginBottom: Spacing.threeQuarters,
  },
};
