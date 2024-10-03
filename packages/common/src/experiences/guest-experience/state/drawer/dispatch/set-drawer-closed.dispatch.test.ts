// Copyright 2022 Prescryptive Health, Inc.

import { setDrawerClosedAction } from '../actions/set-drawer-closed.action';
import { setDrawerClosedDispatch } from './set-drawer-closed.dispatch';

describe('setDrawerClosedDispatch', () => {
  it('dispatches expected set drawer closed action', () => {
    const dispatchMock = jest.fn();

    setDrawerClosedDispatch(dispatchMock);

    const expectedAction = setDrawerClosedAction();

    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
