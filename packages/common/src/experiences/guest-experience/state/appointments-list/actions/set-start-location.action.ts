// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentsListAction } from './appointments-list.action';

export type ISetStartLocationAction = IAppointmentsListAction<'SET_START'>;

export const setStartLocationAction = (startLocation: number): ISetStartLocationAction => ({
  type: 'SET_START',
  payload: { start: startLocation }
});