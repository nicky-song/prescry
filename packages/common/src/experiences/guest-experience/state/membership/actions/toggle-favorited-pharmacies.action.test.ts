// Copyright 2022 Prescryptive Health, Inc.

import { toggleFavoritedPharmaciesAction } from './toggle-favorited-pharmacies.action';

describe('setMemberProfileAction', () => {
  it('returns action', () => {
    const favoritePharmacyNcpdpMock = 'favorite-pharmacy-ncpdp-mock';

    const action = toggleFavoritedPharmaciesAction(favoritePharmacyNcpdpMock);
    expect(action.type).toEqual('TOGGLE_FAVORITED_PHARMACIES');
    expect(action.payload).toEqual({
      favoritePharmacyNcpdp: favoritePharmacyNcpdpMock,
    });
  });
});
