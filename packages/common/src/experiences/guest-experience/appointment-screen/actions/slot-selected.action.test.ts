// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';
import { availableSlotMock } from '../__mocks__/available-slot.mock';
import { slotSelectedAction } from './slot-selected.action';

describe('slotSelectedAction', () => {
  it('returns action', () => {
    const action = slotSelectedAction(availableSlotMock);

    expect(action.type).toEqual('SLOT_SELECTED');

    const expectedPayload: Partial<IAppointmentScreenState> = {
      selectedSlot: availableSlotMock,
      hasSlotExpired: false,
      selectedOnce: true,
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
