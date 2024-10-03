// Copyright 2021 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { ISessionState } from '../session.state';
import { userLocationSetAction } from './user-location-set.action';

describe('userCoordinatesSetAction', () => {
  it('returns action', () => {
    const userLocationMock: ILocationCoordinates = {
      city: 'city-mock',
      state: 'state-mock',
      zipCode: 'zipcode-mock',
      longitude: 1,
      latitude: -1,
    };

    const action = userLocationSetAction(userLocationMock);

    expect(action.type).toEqual('USER_LOCATION_SET');

    const expectedPayload: Partial<ISessionState> = {
      userLocation: userLocationMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
  it('returns action if userLocation is undefined', () => {
    const userLocationMock = undefined;

    const action = userLocationSetAction(userLocationMock);

    expect(action.type).toEqual('USER_LOCATION_SET');

    const expectedPayload: Partial<ISessionState> = {
      userLocation: undefined,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
