// Copyright 2022 Prescryptive Health, Inc.

import { SortByOption } from '../../../screens/drug-search/configure-filters/configure-filters.screen';
import { ISessionAction } from './session.action';

export type ISetFilterPreferencesAction =
  ISessionAction<'SET_FILTER_PREFERENCES'>;

export const setFilterPreferencesAction = (
  sortBy: SortByOption,
  distance: number
): ISetFilterPreferencesAction => ({
  type: 'SET_FILTER_PREFERENCES',
  payload: {
    pharmacyFilterPreferences: {
      sortBy,
      distance,
    },
  },
});
