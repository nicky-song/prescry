// Copyright 2022 Prescryptive Health, Inc.

import { IFindLocationState } from '../find-location.state';
import { setIsAutocompletingUserLocationsAction } from './set-is-autocompleting-user-location.action';

describe('setIsAutocompletingUserLocationsAction', () => {
  it('returns action', () => {
    const isAutocompletingUserLocationMock = false;
    const action = setIsAutocompletingUserLocationsAction(
      isAutocompletingUserLocationMock
    );

    expect(action.type).toEqual('SET_IS_AUTOCOMPLETING_USER_LOCATION');
    const expectedPayload: Partial<IFindLocationState> = {
      isAutocompletingUserLocation: isAutocompletingUserLocationMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
