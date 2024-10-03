// Copyright 2021 Prescryptive Health, Inc.

import { hideLoadingAction } from '../actions/hide-loading.action';
import { hideLoadingDispatch } from './hide-loading.dispatch';

describe('hideLoadingDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches action', () => {
    const dispatchMock = jest.fn();

    hideLoadingDispatch(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith(hideLoadingAction());
  });
});
