// Copyright 2022 Prescryptive Health, Inc.

import { setDrawerOpenAction } from '../actions/set-drawer-open.action';
import { setDrawerOpenDispatch } from './set-drawer-open.dispatch';

describe('setDrawerOpenDispatch', () => {
  it('dispatches expected set drawer open action', () => {
    const dispatchMock = jest.fn();

    setDrawerOpenDispatch(dispatchMock);

    const expectedAction = setDrawerOpenAction();

    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
