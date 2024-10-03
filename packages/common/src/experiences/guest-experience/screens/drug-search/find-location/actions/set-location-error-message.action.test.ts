// Copyright 2022 Prescryptive Health, Inc.

import { IFindLocationState } from '../find-location.state';
import { setLocationErrorMessageAction } from './set-location-error-message.action';

describe('setLocationErrorMessageAction', () => {
  it('returns action', () => {
    const locationErrorMessageMock = 'Error Found';
    const action = setLocationErrorMessageAction(locationErrorMessageMock);

    expect(action.type).toEqual('SET_LOCATION_ERROR_MESSAGE');
    const expectedPayload: Partial<IFindLocationState> = {
      locationErrorMessage: locationErrorMessageMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
