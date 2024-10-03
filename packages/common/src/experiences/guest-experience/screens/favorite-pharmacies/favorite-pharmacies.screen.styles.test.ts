// Copyright 2022 Prescryptive Health, Inc.

import {
  IFavoritePharmaciesScreenStyles,
  favoritePharmaciesScreenStyles,
} from './favorite-pharmacies.screen.styles';
import { Spacing } from '../../../../theming/spacing';

describe('favoritePharmaciesScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IFavoritePharmaciesScreenStyles = {
      errorMessageTextStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
      },
      favoritingNotificationViewStyle: { marginBottom: Spacing.base },
      favoritePharmacyCardViewStyle: {
        marginBottom: Spacing.times2,
      },
    };

    expect(favoritePharmaciesScreenStyles).toEqual(expectedStyles);
  });
});
