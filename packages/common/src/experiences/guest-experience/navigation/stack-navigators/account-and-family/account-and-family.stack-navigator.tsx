// Copyright 2022 Prescryptive Health, Inc.

import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import {
  PrescriptionPersonScreen,
  IPrescriptionPersonScreenRouteProps,
} from '../../../screens/prescription-person/prescription-person.screen';
import {
  VerifyPatientInfoScreen,
  IVerifyPatientInfoScreenRouteProps,
} from '../../../screens/verify-patient-info/verify-patient-info.screen';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import { RootStackNavigationProp } from '../root/root.stack-navigator';

export type AccountAndFamilyStackParamList = {
  PrescriptionPerson: IPrescriptionPersonScreenRouteProps;
  VerifyPatientInfo: IVerifyPatientInfoScreenRouteProps;
};

export type AccountAndFamilyStackScreenName =
  keyof AccountAndFamilyStackParamList;

type ScreenNavigationProp<TScreenName extends AccountAndFamilyStackScreenName> =
  RootStackNavigationProp &
    StackNavigationProp<AccountAndFamilyStackParamList, TScreenName>;

type ScreenRouteProp<TScreenName extends AccountAndFamilyStackScreenName> =
  RouteProp<AccountAndFamilyStackParamList, TScreenName>;

export type PrescriptionPersonNavigationProp =
  ScreenNavigationProp<'PrescriptionPerson'>;
export type PrescriptionPersonRouteProp = ScreenRouteProp<'PrescriptionPerson'>;

export type VerifyPatientInfoNavigationProp =
  ScreenNavigationProp<'VerifyPatientInfo'>;
export type VerifyPatientInfoRouteProp = ScreenRouteProp<'VerifyPatientInfo'>;

export type AccountAndFamilyStackNavigationProp = RootStackNavigationProp &
  StackNavigationProp<
    AccountAndFamilyStackParamList,
    AccountAndFamilyStackScreenName
  >;

export const AccountAndFamilyStackNavigator = (): ReactElement => {
  const Stack = createStackNavigator<AccountAndFamilyStackParamList>();
  return (
    <Stack.Navigator
      screenOptions={defaultStackNavigationScreenOptions}
      screenListeners={defaultScreenListeners}
    >
      <Stack.Screen
        name='PrescriptionPerson'
        component={PrescriptionPersonScreen}
      />
      <Stack.Screen
        name='VerifyPatientInfo'
        component={VerifyPatientInfoScreen}
      />
    </Stack.Navigator>
  );
};
