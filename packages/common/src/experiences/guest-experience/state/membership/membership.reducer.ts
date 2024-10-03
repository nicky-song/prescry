// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'react';
import { FavoritingAction } from '../../../../components/buttons/favorite-icon/favorite-icon.button';
import { LanguageCode } from '../../../../models/language';
import { MembershipAction } from './actions/membership.action';
import { toggleFavoritedPharmacyHelper } from './helpers/toggle-favorited-pharmacy.helper';
import { IMembershipState } from './membership.state';

export type MembershipReducer = Reducer<IMembershipState, MembershipAction>;

export const membershipReducer: MembershipReducer = (
  state: IMembershipState,
  action: MembershipAction
): IMembershipState => {

  switch (action.type) {
    case 'TOGGLE_FAVORITED_PHARMACIES': {
      const payload = action.payload as Partial<IMembershipState>;
      const favoritePharmacyNcpdp = payload.favoritePharmacyNcpdp;

      if (!favoritePharmacyNcpdp) {
        return state;
      }

      const favoritedPharmacies = state.account.favoritedPharmacies;

      const updatedFavoritedPharmacies = toggleFavoritedPharmacyHelper(
        favoritePharmacyNcpdp,
        favoritedPharmacies
      );

      const favoritingAction: FavoritingAction =
        updatedFavoritedPharmacies.length > favoritedPharmacies.length
          ? 'favoriting'
          : 'unfavoriting';

      return {
        ...state,
        account: {
          ...state.account,
          favoritedPharmacies: updatedFavoritedPharmacies,
        },
        favoritingAction,
      };
    }
    case 'SET_LANGUAGE_CODE': {
      if (!action.payload) {
        return state;
      }

      return {
        ...state,
        account: {
          ...state.account,
          languageCode: action.payload as LanguageCode,
        },
      };
    }
    default: {
      const payload = action.payload as Partial<IMembershipState>;

      return { ...state, ...payload };
    }
  }
};
