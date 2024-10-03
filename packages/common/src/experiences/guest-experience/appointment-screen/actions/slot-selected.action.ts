// Copyright 2021 Prescryptive Health, Inc.

import { IAvailableSlot } from '../../../../models/api-response/available-slots-response';
import { IAppointmentScreenState } from '../appointment.screen.state';
import { IAppointmentScreenAction } from './appointment.screen.action';

export type ISlotSelectedAction = IAppointmentScreenAction<'SLOT_SELECTED'>;

export const slotSelectedAction = (
  slot?: IAvailableSlot
): ISlotSelectedAction => {
  const payload: Partial<IAppointmentScreenState> = {
    selectedSlot: slot,
    hasSlotExpired: false,
    selectedOnce: true,
  };

  return {
    type: 'SLOT_SELECTED',
    payload,
  };
};
