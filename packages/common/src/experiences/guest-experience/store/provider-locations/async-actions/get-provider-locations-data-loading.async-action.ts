// Copyright 2020 Prescryptive Health, Inc.

import { IZipcodeParam } from '../../../../../components/member/lists/pharmacy-locations-list/pharmacy-locations-list';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { getProviderLocationsAsyncAction } from './get-provider-locations.async-action';

export const getProviderLocationsDataLoadingAsyncAction = (
  navigation: AppointmentsStackNavigationProp,
  zipcodeParam: IZipcodeParam
) =>
  dataLoadingAction(getProviderLocationsAsyncAction, {
    navigation,
    zipcodeParam,
  });
