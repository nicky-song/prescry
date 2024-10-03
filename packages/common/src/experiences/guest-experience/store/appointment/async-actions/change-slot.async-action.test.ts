// Copyright 2021 Prescryptive Health, Inc.

import { changeSlotAsyncAction } from './change-slot.async-action';
import { ISelectedSlot } from '../actions/change-slot.action';
import { changeSlotDispatch } from '../dispatch/change-slot.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../dispatch/change-slot.dispatch');
const changeSlotDispatchMock = changeSlotDispatch as jest.Mock;

const selectedSlot = {
  slotName: '8:00 am',
  bookingId: 'mock-booking-id',
} as ISelectedSlot;

const getStateMock = jest.fn();
const defaultStateMock = {};

describe('changeSlotAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls changeSlotDispatch', async () => {
    const dispatchMock = jest.fn();

    const asyncAction = changeSlotAsyncAction({
      navigation: rootStackNavigationMock,
      selectedSlot,
    });
    await asyncAction(dispatchMock, getStateMock);
    expect(changeSlotDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      selectedSlot,
      rootStackNavigationMock
    );
  });
});
