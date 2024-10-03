// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentAction } from './appointment-action';

export type IResetNewDependentErrorAction = IAppointmentAction<
  'APPOINTMENT_RESET_NEW_DEPENDENT_ERROR',
  undefined
>;

export const resetNewDependentErrorAction =
  (): IResetNewDependentErrorAction => ({
    payload: undefined,
    type: 'APPOINTMENT_RESET_NEW_DEPENDENT_ERROR',
  });
