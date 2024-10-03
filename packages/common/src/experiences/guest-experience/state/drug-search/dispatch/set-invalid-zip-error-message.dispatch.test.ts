// Copyright 2021 Prescryptive Health, Inc.

import { setInvalidZipErrorMessageAction } from '../actions/set-invalid-zip-error-message.action';
import { setInvalidZipErrorMessageDispatch } from './set-invalid-zip-error-message.dispatch';

describe('setInvalidZipErrorMessageDispatch', () => {
  it('dispatches expected action', () => {
    const drugSearchDispatchMock = jest.fn();
    const errorMock = 'some-error';

    setInvalidZipErrorMessageDispatch(drugSearchDispatchMock, errorMock);

    const expectedAction = setInvalidZipErrorMessageAction(errorMock);
    expect(drugSearchDispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
