// Copyright 2021 Prescryptive Health, Inc.

import { showLoadingAction } from '../actions/show-loading.action';
import { showLoadingDispatch } from './show-loading.dispatch';

describe('showLoadingDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches action', () => {
    const dispatchMock = jest.fn();
    const showMessageMock = true;
    const messageMock = 'message';

    showLoadingDispatch(dispatchMock, showMessageMock, messageMock);

    expect(dispatchMock).toHaveBeenCalledWith(
      showLoadingAction(showMessageMock, messageMock)
    );
  });
});
