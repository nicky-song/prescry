// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentAction } from './appointment-action';

export type IResetAppointmentStateAction = IAppointmentAction<
  'APPOINTMENT_RESET_STATE',
  undefined
>;

export const resetAppointmentStateAction =
  (): IResetAppointmentStateAction => ({
    payload: undefined,
    type: 'APPOINTMENT_RESET_STATE',
  });
