// Copyright 2021 Prescryptive Health, Inc.

import { dateSelectedAction } from '../actions/date-selected.action';
import { AppointmentScreenDispatch } from './appointment.screen.dispatch';

export const dateSelectedDispatch = (dispatch: AppointmentScreenDispatch) =>
  dispatch(dateSelectedAction());
