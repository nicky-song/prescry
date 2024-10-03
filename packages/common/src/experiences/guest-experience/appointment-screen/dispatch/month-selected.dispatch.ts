// Copyright 2021 Prescryptive Health, Inc.

import { monthSelectedAction } from '../actions/month-selected.action';
import { AppointmentScreenDispatch } from './appointment.screen.dispatch';

export const monthSelectedDispatch = (dispatch: AppointmentScreenDispatch) =>
  dispatch(monthSelectedAction());
