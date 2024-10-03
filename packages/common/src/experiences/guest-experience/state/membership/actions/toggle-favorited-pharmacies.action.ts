// Copyright 2022 Prescryptive Health, Inc.

import { IMembershipAction } from './membership.action';

export type IToggleFavoritedPharmaciesAction =
  IMembershipAction<'TOGGLE_FAVORITED_PHARMACIES'>;

export const toggleFavoritedPharmaciesAction = (
  favoritePharmacyNcpdp: string
): IToggleFavoritedPharmaciesAction => ({
  payload: { favoritePharmacyNcpdp },
  type: 'TOGGLE_FAVORITED_PHARMACIES',
});
