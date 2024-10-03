// Copyright 2020 Prescryptive Health, Inc.

import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { getAppointmentDetailsAsyncAction } from './get-appointment-details.async-action';

export const getAppointmentDetailsDataLoadingAsyncAction = (
  navigation: AppointmentsStackNavigationProp,
  appointmentId: string
) =>
  dataLoadingAction(getAppointmentDetailsAsyncAction, {
    navigation,
    appointmentId,
  });
