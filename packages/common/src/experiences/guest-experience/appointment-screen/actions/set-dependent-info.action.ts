// Copyright 2021 Prescryptive Health, Inc.

import { IDependentInformation } from '../../../../models/api-request-body/create-booking.request-body';
import { IAppointmentScreenState } from '../appointment.screen.state';
import { IAppointmentScreenAction } from './appointment.screen.action';

export type ISetDependentInfoAction = IAppointmentScreenAction<
  'SET_DEPENDENT_INFO'
>;

export const setDependentInfoAction = (
  dependentInfo?: IDependentInformation
): ISetDependentInfoAction => {
  const payload: Partial<IAppointmentScreenState> = {
    dependentInfo,
  };

  return {
    type: 'SET_DEPENDENT_INFO',
    payload,
  };
};
