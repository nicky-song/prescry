// Copyright 2021 Prescryptive Health, Inc.

import { slotExpiredAction } from '../actions/slot-expired.action';
import { AppointmentScreenDispatch } from './appointment.screen.dispatch';

export const slotExpiredDispatch = (dispatch: AppointmentScreenDispatch) =>
  dispatch(slotExpiredAction());
