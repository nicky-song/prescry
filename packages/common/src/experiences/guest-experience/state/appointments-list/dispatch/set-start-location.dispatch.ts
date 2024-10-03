// Copyright 2021 Prescryptive Health, Inc.

import { setStartLocationAction } from '../actions/set-start-location.action';
import { AppointmentsListDispatch } from '../dispatch/appointments-list.dispatch';

export const setStartLocationDispatch = (
  dispatch: AppointmentsListDispatch,
  startLocation: number,
): void => {
  dispatch(setStartLocationAction(startLocation));
};
