// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentsListState } from '../appointments-list.state';

type ActionKeys =
  | 'SET_APPOINTMENTS_TYPE'
  | 'SET_START'
  | 'SET_CURRENT_APPOINTMENTS';

export interface IAppointmentsListAction<T extends ActionKeys> {
  readonly type: T;
  readonly payload: Partial<IAppointmentsListState>;
}

export type AppointmentsListAction = IAppointmentsListAction<ActionKeys>;