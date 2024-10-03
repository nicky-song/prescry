// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface IFavoritePharmacyCardStyles {
  favoritePharmacyCardViewStyle: ViewStyle;
  pharmacyNameAndAddressViewStyle: ViewStyle;
  pharmacyNameTextStyle: TextStyle;
  favoriteIconButtonWrapperViewStyle: ViewStyle;
  favoriteIconButtonViewStyle: ViewStyle;
}

export const favoritePharmacyCardStyles: IFavoritePharmacyCardStyles = {
  favoritePharmacyCardViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pharmacyNameAndAddressViewStyle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 4,
  },
  pharmacyNameTextStyle: {
    ...getFontFace({ weight: FontWeight.bold }),
    marginBottom: Spacing.half,
  },
  favoriteIconButtonWrapperViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  favoriteIconButtonViewStyle: {
    marginLeft: Spacing.times1pt5,
  },
};
