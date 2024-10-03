// Copyright 2022 Prescryptive Health, Inc.

import { SortByOption } from '../../../screens/drug-search/configure-filters/configure-filters.screen';
import { setFilterPreferencesAction } from '../actions/set-filter-preferences.action';
import { SessionDispatch } from './session.dispatch';

export const setFilterPreferencesDispatch = (
  dispatch: SessionDispatch,
  sortBy: SortByOption,
  distance: number
): void => {
  dispatch(setFilterPreferencesAction(sortBy, distance));
};
