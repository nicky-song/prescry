// Copyright 2021 Prescryptive Health, Inc.

import { slotExpiredAction } from '../actions/slot-expired.action';
import { slotExpiredDispatch } from './slot-expired.dispatch';

describe('slotExpiredDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    slotExpiredDispatch(dispatchMock);

    const expectedAction = slotExpiredAction();
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
