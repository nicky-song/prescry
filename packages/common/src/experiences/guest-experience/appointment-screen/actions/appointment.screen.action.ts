// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';

type ActionKeys =
  | 'DATE_SELECTED'
  | 'MONTH_SELECTED'
  | 'RESET_ANSWERS'
  | 'SET_ANSWER'
  | 'SET_CONSENT'
  | 'SET_DEPENDENT_INFO'
  | 'SET_MEMBER_ADDRESS'
  | 'SLOT_EXPIRED'
  | 'SLOT_SELECTED';

export interface IAppointmentScreenAction<
  T extends ActionKeys,
  TPayload = unknown
> {
  readonly type: T;
  readonly payload: Partial<IAppointmentScreenState> | TPayload;
}

export type AppointmentScreenAction = IAppointmentScreenAction<ActionKeys>;
