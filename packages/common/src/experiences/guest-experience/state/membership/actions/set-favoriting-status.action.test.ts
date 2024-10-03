// Copyright 2022 Prescryptive Health, Inc.

import { FavoritingStatus } from '../../../../../components/notifications/all-favorite/all-favorite.notifications';
import { setFavoritingStatusAction } from './set-favoriting-status.action';

describe('setFavoritingStatusAction', () => {
  it('returns action', () => {
    const favoritingStatusMock: FavoritingStatus = 'success';

    const action = setFavoritingStatusAction(favoritingStatusMock);
    expect(action.type).toEqual('SET_FAVORITING_STATUS');
    expect(action.payload).toEqual({ favoritingStatus: favoritingStatusMock });
  });
});
