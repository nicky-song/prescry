// Copyright 2021 Prescryptive Health, Inc.

import { ISessionState } from '../session.state';
import { setIsGettingUserLocationAction } from './set-is-getting-user-location.action';

describe('setIsGettingUserLocationAction', () => {
  it('returns action', () => {
    const isGettingUserLocationMock = false;

    const action = setIsGettingUserLocationAction(isGettingUserLocationMock);

    expect(action.type).toEqual('SET_IS_GETTING_USER_LOCATION');

    const expectedPayload: Partial<ISessionState> = {
      isGettingUserLocation: isGettingUserLocationMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
