// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';
import { slotExpiredAction } from './slot-expired.action';

describe('slotExpiredAction', () => {
  it('returns action', () => {
    const action = slotExpiredAction();

    expect(action.type).toEqual('SLOT_EXPIRED');

    const expectedPayload: Partial<IAppointmentScreenState> = {
      selectedSlot: undefined,
      hasSlotExpired: true,
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
