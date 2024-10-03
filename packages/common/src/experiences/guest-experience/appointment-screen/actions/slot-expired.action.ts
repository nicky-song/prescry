// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';
import { IAppointmentScreenAction } from './appointment.screen.action';

export type ISlotExpiredAction = IAppointmentScreenAction<'SLOT_EXPIRED'>;

export const slotExpiredAction = (): ISlotExpiredAction => {
  const payload: Partial<IAppointmentScreenState> = {
    selectedSlot: undefined,
    hasSlotExpired: true,
  };

  return {
    type: 'SLOT_EXPIRED',
    payload,
  };
};
