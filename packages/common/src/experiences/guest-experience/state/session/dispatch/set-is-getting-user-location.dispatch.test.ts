// Copyright 2021 Prescryptive Health, Inc.

import { setIsGettingUserLocationAction } from '../actions/set-is-getting-user-location.action';
import { setIsGettingUserLocationDispatch } from './set-is-getting-user-location.dispatch';

describe('setIsGettingUserLocationDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    const isGettingUserLocationMock = true;
    setIsGettingUserLocationDispatch(dispatchMock, isGettingUserLocationMock);

    const expectedAction = setIsGettingUserLocationAction(
      isGettingUserLocationMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
