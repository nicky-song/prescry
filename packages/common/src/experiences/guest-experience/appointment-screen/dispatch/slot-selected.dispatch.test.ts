// Copyright 2021 Prescryptive Health, Inc.

import { slotSelectedAction } from '../actions/slot-selected.action';
import { availableSlotMock } from '../__mocks__/available-slot.mock';
import { slotSelectedDispatch } from './slot-selected.dispatch';

describe('slotSelectedDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    slotSelectedDispatch(dispatchMock, availableSlotMock);

    const expectedAction = slotSelectedAction(availableSlotMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
