// Copyright 2022 Prescryptive Health, Inc.

import { FavoritingStatus } from '../../../../../components/notifications/all-favorite/all-favorite.notifications';
import { setFavoritingStatusAction } from '../actions/set-favoriting-status.action';
import { setFavoritingStatusDispatch } from './set-favoriting-status.dispatch';

describe('setFavoritingStatusDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    const favoritingStatusMock: FavoritingStatus = 'success';

    setFavoritingStatusDispatch(dispatchMock, favoritingStatusMock);

    const expectedAction = setFavoritingStatusAction(favoritingStatusMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
