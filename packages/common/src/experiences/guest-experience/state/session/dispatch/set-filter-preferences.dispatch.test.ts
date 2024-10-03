// Copyright 2022 Prescryptive Health, Inc.

import { setFilterPreferencesAction } from '../actions/set-filter-preferences.action';
import { setFilterPreferencesDispatch } from './set-filter-preferences.dispatch';

describe('setFilterPreferencesDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    const distanceMock = 1;
    const sortByMock = 'distance';

    setFilterPreferencesDispatch(dispatchMock, sortByMock, distanceMock);

    const expectedAction = setFilterPreferencesAction(sortByMock, distanceMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
