// Copyright 2021 Prescryptive Health, Inc.

import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { cancelAppointmentAsyncAction } from './cancel-appointment.async-action';

export const cancelAppointmentDataLoadingAsyncAction = (
  navigation: AppointmentsStackNavigationProp,
  orderNumber: string
) =>
  dataLoadingAction(
    cancelAppointmentAsyncAction,
    { navigation, orderNumber },
    true
  );
