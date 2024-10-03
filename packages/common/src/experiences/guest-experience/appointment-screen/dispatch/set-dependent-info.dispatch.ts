// Copyright 2021 Prescryptive Health, Inc.

import { IDependentInformation } from '../../../../models/api-request-body/create-booking.request-body';
import { setDependentInfoAction } from '../actions/set-dependent-info.action';
import { AppointmentScreenDispatch } from './appointment.screen.dispatch';

export const setDependentInfoDispatch = (
  dispatch: AppointmentScreenDispatch,
  dependentInfo?: IDependentInformation
) => dispatch(setDependentInfoAction(dependentInfo));
