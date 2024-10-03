// Copyright 2021 Prescryptive Health, Inc.

import { ISessionState } from '../session.state';
import { setIsUserAuthenticatedAction } from './set-is-user-authenticated.action';

describe('setIsUserAuthenticatedAction', () => {
  it('returns action', () => {
    const isUserAuthenticatedMock = false;

    const action = setIsUserAuthenticatedAction(isUserAuthenticatedMock);

    expect(action.type).toEqual('SET_IS_USER_AUTHENTICATED');

    const expectedPayload: Partial<ISessionState> = {
      isUserAuthenticated: isUserAuthenticatedMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
