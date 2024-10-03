// Copyright 2021 Prescryptive Health, Inc.

import { ISelectedSlot, setChangeSlotAction } from './change-slot.action';

describe('setChangeSlotAction', () => {
  it('returns action', () => {
    const selectedSlot = {
      slotName: '8:00 am',
      bookingId: 'mock-booking-id',
    } as ISelectedSlot;
    const action = setChangeSlotAction(selectedSlot);

    expect(action.type).toEqual('APPOINTMENT_CHANGE_SLOT');
    expect(action.payload).toEqual(selectedSlot);
  });
});
