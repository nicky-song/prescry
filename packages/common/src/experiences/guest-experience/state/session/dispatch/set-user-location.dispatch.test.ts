// Copyright 2021 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { setUserLocationDispatch } from './set-user-location.dispatch';

describe('setUserLocationDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    const userLocationMock: ILocationCoordinates = {
      city: 'city-mock',
      state: 'state-mock',
      zipCode: 'zipcode-mock',
      longitude: 1,
      latitude: -1,
    };

    setUserLocationDispatch(dispatchMock, userLocationMock);

    const expectedAction = {
      payload: { userLocation: userLocationMock },
      type: 'USER_LOCATION_SET',
    };
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
  it('dispatches expected action if location is undefined', () => {
    const dispatchMock = jest.fn();

    const userLocationMock = undefined;

    setUserLocationDispatch(dispatchMock, userLocationMock);

    const expectedAction = {
      payload: { userLocation: userLocationMock },
      type: 'USER_LOCATION_SET',
    };
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
