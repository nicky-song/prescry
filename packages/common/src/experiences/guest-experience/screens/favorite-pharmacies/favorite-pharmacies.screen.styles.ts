// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';

export interface IFavoritePharmaciesScreenStyles {
  errorMessageTextStyle: TextStyle;
  favoritingNotificationViewStyle: ViewStyle;
  favoritePharmacyCardViewStyle: ViewStyle;
}

export const favoritePharmaciesScreenStyles: IFavoritePharmaciesScreenStyles = {
  errorMessageTextStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
  },
  favoritingNotificationViewStyle: { marginBottom: Spacing.base },
  favoritePharmacyCardViewStyle: {
    marginBottom: Spacing.times2,
  },
};
