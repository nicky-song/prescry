// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentAction } from './appointment-action';

export type IChangeSlotActionErrorAction = IAppointmentAction<
  'APPOINTMENT_CHANGE_SLOT_ERROR',
  string
>;

export const changeSlotErrorAction = (
  error: string
): IChangeSlotActionErrorAction => ({
  payload: error,
  type: 'APPOINTMENT_CHANGE_SLOT_ERROR',
});
