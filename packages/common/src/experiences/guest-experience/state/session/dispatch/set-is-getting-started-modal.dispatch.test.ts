// Copyright 2021 Prescryptive Health, Inc.

import { setIsGettingStartedModalOpenAction } from '../actions/set-is-getting-started-modal-open.action';
import { setIsGettingStartedModalOpenDispatch } from './set-is-getting-started-modal.dispatch';

describe('setIsGettingStartedModalOpenDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    const isGettingStartedModalOpenMock = true;
    setIsGettingStartedModalOpenDispatch(
      dispatchMock,
      isGettingStartedModalOpenMock
    );

    const expectedAction = setIsGettingStartedModalOpenAction(
      isGettingStartedModalOpenMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
