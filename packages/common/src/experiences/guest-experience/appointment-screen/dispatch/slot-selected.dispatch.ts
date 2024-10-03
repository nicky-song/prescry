// Copyright 2021 Prescryptive Health, Inc.

import { IAvailableSlot } from '../../../../models/api-response/available-slots-response';
import { slotSelectedAction } from '../actions/slot-selected.action';
import { AppointmentScreenDispatch } from './appointment.screen.dispatch';

export const slotSelectedDispatch = (
  dispatch: AppointmentScreenDispatch,
  slot?: IAvailableSlot
) => dispatch(slotSelectedAction(slot));
