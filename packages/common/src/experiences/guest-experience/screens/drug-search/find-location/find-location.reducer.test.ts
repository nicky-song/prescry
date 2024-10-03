// Copyright 2022 Prescryptive Health, Inc.

import { setIsAutocompletingUserLocationsAction } from './actions/set-is-autocompleting-user-location.action';
import { setActiveSuggestedLocationAction } from './actions/set-active-suggested-location.action';
import { suggestedLocationsSetAction } from './actions/suggested-locations-set.action';
import { findLocationReducer } from './find-location.reducer';
import { IFindLocationState } from './find-location.state';
import { locationCoordinatesMock } from '../../../__mocks__/location-coordinate.mock';

const defaultFindLocationMock: IFindLocationState = {
  isAutocompletingUserLocation: false,
};

describe('findLocationReducer', () => {
  it('reduces setIsAutocompletingUserLocation action', () => {
    const action = setIsAutocompletingUserLocationsAction(true);

    const initialState: IFindLocationState = {
      ...defaultFindLocationMock,
    };
    const reducedStdate = findLocationReducer(initialState, action);

    const expectedState: IFindLocationState = {
      isAutocompletingUserLocation: true,
    };
    expect(reducedStdate).toEqual(expectedState);
  });

  it('reduces setActiveSuggestedLocation action', () => {
    const action = setActiveSuggestedLocationAction(locationCoordinatesMock);

    const initialState: IFindLocationState = {
      ...defaultFindLocationMock,
    };
    const reducedStdate = findLocationReducer(initialState, action);

    const expectedState: IFindLocationState = {
      ...initialState,
      activeSuggestedLocation: locationCoordinatesMock,
    };
    expect(reducedStdate).toEqual(expectedState);
  });

  it('reduces suggestedLocationsSet action', () => {
    const action = suggestedLocationsSetAction([locationCoordinatesMock]);

    const initialState: IFindLocationState = {
      ...defaultFindLocationMock,
    };
    const reducedStdate = findLocationReducer(initialState, action);

    const expectedState: IFindLocationState = {
      ...initialState,
      suggestedLocations: [locationCoordinatesMock],
    };
    expect(reducedStdate).toEqual(expectedState);
  });
});
