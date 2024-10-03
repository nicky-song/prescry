// Copyright 2022 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import {
  favoritePharmacyCardStyles,
  IFavoritePharmacyCardStyles,
} from './favorite-pharmacy.card.styles';

describe('favoritePharmacyCardStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IFavoritePharmacyCardStyles = {
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

    expect(favoritePharmacyCardStyles).toEqual(expectedStyles);
  });
});
