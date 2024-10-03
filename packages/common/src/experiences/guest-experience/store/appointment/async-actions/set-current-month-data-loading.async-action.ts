// Copyright 2020 Prescryptive Health, Inc.

import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { setCurrentMonthAsyncAction } from './set-current-month.async-action';

export const setCurrentMonthDataLoadingAsyncAction = (
  navigation: AppointmentsStackNavigationProp,
  date: string
) => dataLoadingAction(setCurrentMonthAsyncAction, { navigation, date });
