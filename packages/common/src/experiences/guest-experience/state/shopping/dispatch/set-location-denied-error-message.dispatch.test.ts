// Copyright 2022 Prescryptive Health, Inc.

import { setLocationDeniedErrorMessageAction } from '../actions/set-location-denied-error-message.action';
import { setLocationDeniedErrorMessageDispatch } from './set-location-denied-error-message.dispatch';

describe('setLocationDeniedErrorMessageDispatch', () => {
  it('dispatches expected action', () => {
    const shoppingDispatchMock = jest.fn();
    const errorMock = 'some-error';

    setLocationDeniedErrorMessageDispatch(shoppingDispatchMock, errorMock);

    const expectedAction = setLocationDeniedErrorMessageAction(errorMock);
    expect(shoppingDispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
