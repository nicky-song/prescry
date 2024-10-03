// Copyright 2021 Prescryptive Health, Inc.

import { setIsUserAuthenticatedAction } from '../actions/set-is-user-authenticated.action';
import { setIsUserAuthenticatedDispatch } from './set-is-user-authenticated.dispatch';

describe('setIsUserAuthenticatedDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    const isUserAuthenticatedMock = true;
    setIsUserAuthenticatedDispatch(dispatchMock, isUserAuthenticatedMock);

    const expectedAction = setIsUserAuthenticatedAction(
      isUserAuthenticatedMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
