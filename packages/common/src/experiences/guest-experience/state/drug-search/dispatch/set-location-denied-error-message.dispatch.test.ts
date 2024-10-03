// Copyright 2022 Prescryptive Health, Inc.

import { setLocationDeniedErrorMessageAction } from '../actions/set-location-denied-error-message.action';
import { setLocationDeniedErrorMessageDispatch } from './set-location-denied-error-message.dispatch';

describe('setLocationDeniedErrorMessageDispatch', () => {
  it('dispatches expected action', () => {
    const drugSearchDispatchMock = jest.fn();
    const errorMock = 'some-error';

    setLocationDeniedErrorMessageDispatch(drugSearchDispatchMock, errorMock);

    const expectedAction = setLocationDeniedErrorMessageAction(errorMock);
    expect(drugSearchDispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
