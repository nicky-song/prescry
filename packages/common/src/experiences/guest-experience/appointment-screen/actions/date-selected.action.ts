// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';
import { IAppointmentScreenAction } from './appointment.screen.action';

export type IDateSelectedAction = IAppointmentScreenAction<'DATE_SELECTED'>;

export const dateSelectedAction = (): IDateSelectedAction => {
  const payload: Partial<IAppointmentScreenState> = {
    selectedDate: true,
    selectedSlot: undefined,
    hasSlotExpired: false,
  };

  return {
    type: 'DATE_SELECTED',
    payload,
  };
};
