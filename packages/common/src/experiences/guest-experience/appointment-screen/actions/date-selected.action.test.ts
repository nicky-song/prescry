// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';
import { dateSelectedAction } from './date-selected.action';

describe('dateSelectedAction', () => {
  it('returns action', () => {
    const action = dateSelectedAction();

    expect(action.type).toEqual('DATE_SELECTED');

    const expectedPayload: Partial<IAppointmentScreenState> = {
      selectedDate: true,
      selectedSlot: undefined,
      hasSlotExpired: false,
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
