// Copyright 2022 Prescryptive Health, Inc.

import { toggleFavoritedPharmaciesAction } from '../actions/toggle-favorited-pharmacies.action';
import { toggleFavoritedPharmaciesDispatch } from './toggle-favorite-pharmacies.dispatch';

describe('setFavoritingStatusDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    const favoritePharmacyNcpdpMock = 'favorite-pharmacy-ncpdp-mock';

    toggleFavoritedPharmaciesDispatch(dispatchMock, favoritePharmacyNcpdpMock);

    const expectedAction = toggleFavoritedPharmaciesAction(
      favoritePharmacyNcpdpMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
