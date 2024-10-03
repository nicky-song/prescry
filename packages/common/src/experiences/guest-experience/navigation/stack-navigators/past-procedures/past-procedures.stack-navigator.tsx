// Copyright 2022 Prescryptive Health, Inc.

import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { PastProceduresContextProvider } from '../../../context-providers/past-procedures/past-procedures.context-provider';
import {
  IPastProceduresListScreenRouteProps,
  PastProceduresListScreen,
} from '../../../screens/past-procedures-list/past-procedures-list.screen';
import { ITestResultScreenRouteProp } from '../../../test-result.screen/test-result.screen';
import { TestResultScreenConnected } from '../../../test-result.screen/test-result.screen.connected';
import { IVaccinationRecordRouteProp } from '../../../vaccination-record-screen/vaccination-record-screen';
import { VaccinationRecordScreenConnected } from '../../../vaccination-record-screen/vaccination-record-screen.connected';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import { RootStackNavigationProp } from '../root/root.stack-navigator';

export type PastProceduresStackParamList = {
  PastProceduresList: IPastProceduresListScreenRouteProps | undefined;
  VaccinationRecord: IVaccinationRecordRouteProp;
  TestResult: ITestResultScreenRouteProp;
};
export type PastProceduresStackScreenName = keyof PastProceduresStackParamList;

type ScreenNavigationProp<TScreenName extends PastProceduresStackScreenName> =
  RootStackNavigationProp &
    StackNavigationProp<PastProceduresStackParamList, TScreenName>;

type ScreenRouteProp<TScreenName extends PastProceduresStackScreenName> =
  RouteProp<PastProceduresStackParamList, TScreenName>;

export type PastProceduresListNavigationProp = RootStackNavigationProp &
  ScreenNavigationProp<'PastProceduresList'>;
export type PastProceduresListRouteProp = ScreenRouteProp<'PastProceduresList'>;

export type TestResultNavigationProp = ScreenNavigationProp<'TestResult'>;
export type TestResultScreenRouteProp = ScreenRouteProp<'TestResult'>;

export type VaccinationRecordNavigationProp =
  ScreenNavigationProp<'VaccinationRecord'>;

export type VaccinationRecordRouteProp = ScreenRouteProp<'VaccinationRecord'>;

export type PastProceduresStackNavigationProp = RootStackNavigationProp &
  StackNavigationProp<
    PastProceduresStackParamList,
    PastProceduresStackScreenName
  >;

export const PastProceduresStackNavigator = (): ReactElement => {
  const Stack = createStackNavigator<PastProceduresStackParamList>();

  return (
    <PastProceduresContextProvider>
      <Stack.Navigator
        screenOptions={defaultStackNavigationScreenOptions}
        screenListeners={defaultScreenListeners}
      >
        <Stack.Screen
          name='PastProceduresList'
          component={PastProceduresListScreen}
        />
        <Stack.Screen
          name='VaccinationRecord'
          component={VaccinationRecordScreenConnected}
        />
        <Stack.Screen name='TestResult' component={TestResultScreenConnected} />
      </Stack.Navigator>
    </PastProceduresContextProvider>
  );
};
