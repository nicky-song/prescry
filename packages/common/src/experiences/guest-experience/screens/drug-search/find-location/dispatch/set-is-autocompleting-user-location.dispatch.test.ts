// Copyright 2022 Prescryptive Health, Inc.

import { setIsAutocompletingUserLocationsAction } from '../actions/set-is-autocompleting-user-location.action';
import { setIsAutocompletingUserLocationDispatch } from './set-is-autocompleting-user-location.dispatch';

describe('setIsAutocompletingUserLocationDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    const isAutocompletingUserLocationMock = true;
    setIsAutocompletingUserLocationDispatch(
      dispatchMock,
      isAutocompletingUserLocationMock
    );

    const expectedAction = setIsAutocompletingUserLocationsAction(
      isAutocompletingUserLocationMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
