// Copyright 2022 Prescryptive Health, Inc.

import { FavoritingStatus } from '../../../../../components/notifications/all-favorite/all-favorite.notifications';
import { IMembershipAction } from './membership.action';

export type ISetFavoritingStatusAction =
  IMembershipAction<'SET_FAVORITING_STATUS'>;

export const setFavoritingStatusAction = (
  favoritingStatus: FavoritingStatus
): ISetFavoritingStatusAction => ({
  payload: { favoritingStatus },
  type: 'SET_FAVORITING_STATUS',
});
