// Copyright 2020 Prescryptive Health, Inc.

import {
  setServiceTypeAction,
  ISetServiceTypeAction,
} from '../../service-type/actions/set-service-type.action';
import { Dispatch } from 'react';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';

export const scheduleTestNavigateAsyncAction = (
  navigation: AppointmentsStackNavigationProp,
  serviceType: string
) => {
  return (dispatch: Dispatch<ISetServiceTypeAction>) => {
    dispatch(
      setServiceTypeAction({
        type: serviceType,
      })
    );
    navigation.navigate('AppointmentsStack', { screen: 'PharmacyLocations' });
  };
};
