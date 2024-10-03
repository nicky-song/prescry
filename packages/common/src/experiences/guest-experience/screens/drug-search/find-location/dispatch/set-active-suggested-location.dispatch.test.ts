// Copyright 2022 Prescryptive Health, Inc.

import { locationCoordinatesMock } from '../../../../__mocks__/location-coordinate.mock';
import { setActiveSuggestedLocationDispatch } from './set-active-suggested-location.dispatch';

describe('setActiveSuggestedLocationDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setActiveSuggestedLocationDispatch(dispatchMock, locationCoordinatesMock);

    const expectedAction = {
      payload: { activeSuggestedLocation: locationCoordinatesMock },
      type: 'SET_ACTIVE_SUGGESTED_LOCATION',
    };
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
  it('dispatches expected action if location is undefined', () => {
    const dispatchMock = jest.fn();
    const userLocationMock = undefined;

    setActiveSuggestedLocationDispatch(dispatchMock, userLocationMock);

    const expectedAction = {
      payload: { activeSuggestedLocation: userLocationMock },
      type: 'SET_ACTIVE_SUGGESTED_LOCATION',
    };
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
