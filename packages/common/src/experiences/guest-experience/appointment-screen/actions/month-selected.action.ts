// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';
import { IAppointmentScreenAction } from './appointment.screen.action';

export type IMonthSelectedAction = IAppointmentScreenAction<'MONTH_SELECTED'>;

export const monthSelectedAction = (): IMonthSelectedAction => {
  const payload: Partial<IAppointmentScreenState> = {
    selectedDate: false,
    selectedSlot: undefined,
    hasSlotExpired: false,
  };

  return {
    type: 'MONTH_SELECTED',
    payload,
  };
};
