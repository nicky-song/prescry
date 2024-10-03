// Copyright 2022 Prescryptive Health, Inc.

import { SortByOption } from '../../../screens/drug-search/configure-filters/configure-filters.screen';
import { ISessionState } from '../session.state';
import { setFilterPreferencesAction } from './set-filter-preferences.action';

describe('setFilterPreferencesAction', () => {
  it('returns action', () => {
    const sortByMock: SortByOption = 'distance';
    const distanceMock = 1;

    const action = setFilterPreferencesAction(sortByMock, distanceMock);

    expect(action.type).toEqual('SET_FILTER_PREFERENCES');

    const expectedPayload: Partial<ISessionState> = {
      pharmacyFilterPreferences: { distance: distanceMock, sortBy: sortByMock },
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
