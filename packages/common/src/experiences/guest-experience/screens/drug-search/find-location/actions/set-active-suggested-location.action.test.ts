// Copyright 2022 Prescryptive Health, Inc.

import { locationCoordinatesMock } from '../../../../__mocks__/location-coordinate.mock';
import { IFindLocationState } from '../find-location.state';
import { setActiveSuggestedLocationAction } from './set-active-suggested-location.action';

describe('setActiveSuggestedLocationAction', () => {
  it('returns action', () => {
    const action = setActiveSuggestedLocationAction(locationCoordinatesMock);

    expect(action.type).toEqual('SET_ACTIVE_SUGGESTED_LOCATION');

    const expectedPayload: Partial<IFindLocationState> = {
      activeSuggestedLocation: locationCoordinatesMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
  it('returns action if location is undefined', () => {
    const locationMock = undefined;
    const action = setActiveSuggestedLocationAction(locationMock);

    expect(action.type).toEqual('SET_ACTIVE_SUGGESTED_LOCATION');

    const expectedPayload: Partial<IFindLocationState> = {
      activeSuggestedLocation: undefined,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
