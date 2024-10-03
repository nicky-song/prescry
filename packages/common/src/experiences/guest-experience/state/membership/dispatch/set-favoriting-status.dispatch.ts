// Copyright 2022 Prescryptive Health, Inc.

import { MembershipDispatch } from './membership.dispatch';
import { FavoritingStatus } from '../../../../../components/notifications/all-favorite/all-favorite.notifications';
import { setFavoritingStatusAction } from '../actions/set-favoriting-status.action';

export const setFavoritingStatusDispatch = (
  dispatch: MembershipDispatch,
  favoritingStatus: FavoritingStatus
): void => dispatch(setFavoritingStatusAction(favoritingStatus));
