// Copyright 2021 Prescryptive Health, Inc.

import { setStartLocationDispatch } from './set-start-location.dispatch';
import { setStartLocationAction } from '../actions/set-start-location.action';

describe('setAppointmentsListDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setStartLocationDispatch(dispatchMock, 0);

    const expectedAction = setStartLocationAction(0);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
