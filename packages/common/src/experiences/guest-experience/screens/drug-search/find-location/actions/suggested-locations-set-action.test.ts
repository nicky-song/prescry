// Copyright 2022 Prescryptive Health, Inc.

import { locationCoordinatesMock } from '../../../../__mocks__/location-coordinate.mock';
import { IFindLocationState } from '../find-location.state';
import { suggestedLocationsSetAction } from './suggested-locations-set.action';

describe('suggestedLocationsSetAction', () => {
  it('returns action', () => {
    const action = suggestedLocationsSetAction([locationCoordinatesMock]);

    expect(action.type).toEqual('SUGGESTED_LOCATIONS_SET');

    const expectedPayload: Partial<IFindLocationState> = {
      suggestedLocations: [locationCoordinatesMock],
    };
    expect(action.payload).toEqual(expectedPayload);
  });
  it('returns action if locations is undefined', () => {
    const locationsMock = undefined;
    const action = suggestedLocationsSetAction(locationsMock);

    expect(action.type).toEqual('SUGGESTED_LOCATIONS_SET');

    const expectedPayload: Partial<IFindLocationState> = {
      suggestedLocations: undefined,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
