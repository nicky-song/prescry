// Copyright 2022 Prescryptive Health, Inc.

import { setLocationErrorMessageAction } from '../actions/set-location-error-message.action';
import { setLocationErrorMessageDispatch } from './set-location-error-message.dispatch';

describe('setLocationErrorMessageDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    const locationErrorMessageMock = 'Error Found';
    setLocationErrorMessageDispatch(dispatchMock, locationErrorMessageMock);

    const expectedAction = setLocationErrorMessageAction(
      locationErrorMessageMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
