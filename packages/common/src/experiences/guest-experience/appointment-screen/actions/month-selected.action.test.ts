// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';
import { monthSelectedAction } from './month-selected.action';

describe('monthSelectedAction', () => {
  it('returns action', () => {
    const action = monthSelectedAction();

    expect(action.type).toEqual('MONTH_SELECTED');

    const expectedPayload: Partial<IAppointmentScreenState> = {
      selectedDate: false,
      selectedSlot: undefined,
      hasSlotExpired: false,
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
