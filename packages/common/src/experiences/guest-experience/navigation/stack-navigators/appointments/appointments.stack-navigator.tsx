// Copyright 2022 Prescryptive Health, Inc.

import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { IAppointmentScreenRouteProps } from '../../../appointment-screen/appointment.screen';
import { AppointmentScreenConnected } from '../../../appointment-screen/appointment.screen.connected';
import { IAppointmentConfirmationRouteProps } from '../../../appointment-confirmation.screen/appointment-confirmation.screen';
import { AppointmentConfirmationScreenConnected } from '../../../appointment-confirmation.screen/appointment-confirmation.screen.connected';
import { AppointmentsListScreen, IAppointmentsListScreenRouteProp } from '../../../appointments-list-screen/appointments-list-screen';
import { IJoinWaitlistScreenRouteProps } from '../../../join-waitlist-screen/join-waitlist-screen';
import { JoinWaitlistScreenConnected } from '../../../join-waitlist-screen/join-waitlist-screen.connected';
import { PharmacyLocationsScreen } from '../../../pharmacy-locations-screen/pharmacy-locations-screen';
import { IServiceSelectionScreenRouteProps } from '../../../service-selection-screen/service-selection-screen';
import { ServiceSelectionScreen } from '../../../service-selection-screen/service-selection-screen';
import {
  IWaitlistConfirmationRouteProps,
  WaitlistConfirmationScreen,
} from '../../../waitlist-confirmation-screen/waitlist-confirmation-screen';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import { RootStackNavigationProp } from '../root/root.stack-navigator';

export type AppointmentsStackParamList = {
  PharmacyLocations: undefined;
  ServiceSelection: IServiceSelectionScreenRouteProps;
  Appointment: IAppointmentScreenRouteProps;
  AppointmentsList: IAppointmentsListScreenRouteProp | undefined;
  AppointmentConfirmation: IAppointmentConfirmationRouteProps;
  JoinWaitlist: IJoinWaitlistScreenRouteProps;
  WaitlistConfirmation: IWaitlistConfirmationRouteProps;
};

export type AppointmentsStackScreenName = keyof AppointmentsStackParamList;

type ScreenNavigationProp<TScreenName extends AppointmentsStackScreenName> =
  RootStackNavigationProp &
    StackNavigationProp<AppointmentsStackParamList, TScreenName>;

type ScreenRouteProp<TScreenName extends AppointmentsStackScreenName> =
  RouteProp<AppointmentsStackParamList, TScreenName>;

export type PharmacyLocationsNavigationProp =
  ScreenNavigationProp<'PharmacyLocations'>;

export type ServiceSelectionNavigationProp =
  ScreenNavigationProp<'ServiceSelection'>;

export type ServiceSelectionRouteProp = ScreenRouteProp<'ServiceSelection'>;

export type AppointmentNavigationProp = ScreenNavigationProp<'Appointment'>;

export type AppointmentRouteProp = ScreenRouteProp<'Appointment'>;
export type AppointmentsListNavigationProp =
  ScreenNavigationProp<'AppointmentsList'>;
export type AppointmentsListRouteProp =
  ScreenRouteProp<'AppointmentsList'>;

export type AppointmentConfirmationNavigationProp =
  ScreenNavigationProp<'AppointmentConfirmation'>;

export type AppointmentConfirmationRouteProp =
  ScreenRouteProp<'AppointmentConfirmation'>;
export type JoinWaitlistNavigationProp = ScreenNavigationProp<'JoinWaitlist'>;
export type JoinWaitlistRouteProp = ScreenRouteProp<'JoinWaitlist'>;

export type WaitlistConfirmationNavigationProp =
  ScreenNavigationProp<'WaitlistConfirmation'>;
export type WaitlistConfirmationRouteProp =
  ScreenRouteProp<'WaitlistConfirmation'>;

export type AppointmentsStackNavigationProp = RootStackNavigationProp &
  StackNavigationProp<AppointmentsStackParamList, AppointmentsStackScreenName>;

export const AppointmentsStackNavigator = (): ReactElement => {
  const Stack = createStackNavigator<AppointmentsStackParamList>();
  return (
    <Stack.Navigator
      screenOptions={defaultStackNavigationScreenOptions}
      screenListeners={defaultScreenListeners}
    >
      <Stack.Screen
        name='PharmacyLocations'
        component={PharmacyLocationsScreen}
      />
      <Stack.Screen
        name='ServiceSelection'
        component={ServiceSelectionScreen}
      />
      <Stack.Screen name='Appointment' component={AppointmentScreenConnected} />
      <Stack.Screen
        name='AppointmentsList'
        component={AppointmentsListScreen}
      />
      <Stack.Screen
        name='AppointmentConfirmation'
        component={AppointmentConfirmationScreenConnected}
      />
      <Stack.Screen
        name='JoinWaitlist'
        component={JoinWaitlistScreenConnected}
      />
      <Stack.Screen
        name='WaitlistConfirmation'
        component={WaitlistConfirmationScreen}
      />
    </Stack.Navigator>
  );
};
