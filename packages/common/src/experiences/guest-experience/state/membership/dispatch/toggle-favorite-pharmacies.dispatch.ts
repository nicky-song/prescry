// Copyright 2022 Prescryptive Health, Inc.

import { toggleFavoritedPharmaciesAction } from '../actions/toggle-favorited-pharmacies.action';
import { MembershipDispatch } from './membership.dispatch';

export const toggleFavoritedPharmaciesDispatch = (
  dispatch: MembershipDispatch,
  favoritePharmacyNcpdp: string
): void => dispatch(toggleFavoritedPharmaciesAction(favoritePharmacyNcpdp));
