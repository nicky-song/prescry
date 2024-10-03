// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentAction } from './appointment-action';

export type ISetInviteCodeAction = IAppointmentAction<
  'APPOINTMENT_SET_INVITE_CODE',
  string
>;

export const setInviteCodeAction = (
  inviteCode: string
): ISetInviteCodeAction => ({
  payload: inviteCode,
  type: 'APPOINTMENT_SET_INVITE_CODE',
});
