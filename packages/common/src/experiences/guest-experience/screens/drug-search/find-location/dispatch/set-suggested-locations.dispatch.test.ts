// Copyright 2022 Prescryptive Health, Inc.

import { locationCoordinatesMock } from '../../../../__mocks__/location-coordinate.mock';
import { setSuggestedLocationsDispatch } from './set-suggested-locations.dispatch';

describe('setSuggestedLocationsDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    setSuggestedLocationsDispatch(dispatchMock, [locationCoordinatesMock]);

    const expectedAction = {
      payload: { suggestedLocations: [locationCoordinatesMock] },
      type: 'SUGGESTED_LOCATIONS_SET',
    };
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
  it('dispatches expected action if locations is undefined', () => {
    const dispatchMock = jest.fn();
    const locationsMock = undefined;

    setSuggestedLocationsDispatch(dispatchMock, locationsMock);

    const expectedAction = {
      payload: { suggestedLocations: locationsMock },
      type: 'SUGGESTED_LOCATIONS_SET',
    };
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
