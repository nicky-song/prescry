// Copyright 2020 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';
import {
  IDispatchPostLoginApiErrorActionsType,
  handlePostLoginApiErrorsAction,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { IGetAppointmentDetailsResponseAction } from '../actions/get-appointment-details-response.action';
import { getAppointmentDetailsDispatch } from '../dispatch/get-appointment-details.dispatch';

export type IGetAppointmentDetailsActionType =
  | IGetAppointmentDetailsResponseAction
  | IDispatchPostLoginApiErrorActionsType;

export const getAppointmentDetailsAsyncAction = (args: {
  navigation: AppointmentsStackNavigationProp;
  appointmentId: string;
}) => {
  return async (
    dispatch: Dispatch<IGetAppointmentDetailsActionType>,
    getState: () => RootState
  ) => {
    try {
      await getAppointmentDetailsDispatch(
        dispatch,
        getState,
        args.appointmentId
      );
      return true;
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
      return false;
    }
  };
};
