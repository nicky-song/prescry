// Copyright 2021 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import { cancelAppointmentAndDispatch } from '../dispatch/cancel-appointment.dispatch';
import { ICancelBookingActionType } from '../dispatch/cancel-booking.dispatch';
import { IGetAppointmentDetailsActionType } from './get-appointment-details.async-action';
import { Dispatch } from 'react';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';

export type ICancelAppointmentAsyncAction =
  | IGetAppointmentDetailsActionType
  | ICancelBookingActionType;

export const cancelAppointmentAsyncAction = (args: {
  navigation: AppointmentsStackNavigationProp;
  orderNumber: string;
}) => {
  return async (
    dispatch: Dispatch<ICancelAppointmentAsyncAction>,
    getState: () => RootState
  ) => {
    await cancelAppointmentAndDispatch(
      dispatch,
      getState,
      args.navigation,
      args.orderNumber
    );
  };
};
