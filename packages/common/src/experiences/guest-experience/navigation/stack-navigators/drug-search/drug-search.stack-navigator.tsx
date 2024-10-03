// Copyright 2021 Prescryptive Health, Inc.

import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { ConfigureMedicationScreen } from '../../../screens/drug-search/configure-medication/configure-medication.screen';
import { DrugSearchHomeScreen } from '../../../screens/drug-search/drug-search-home/drug-search-home.screen';
import { DrugSearchPickAPharmacyScreen } from '../../../screens/drug-search/drug-search-pick-a-pharmacy/drug-search-pick-a-pharmacy.screen';
import {
  FindYourPharmacyScreen,
  IFindYourPharmacyScreenRouteProps,
} from '../../../screens/drug-search/find-pharmacy/find-your-pharmacy.screen';
import {
  IPrescriptionTransferConfirmationRouteProps,
  PrescriptionTransferConfirmationScreen,
} from '../../../screens/drug-search/prescription-transfer-confirmation/prescription-transfer-confirmation.screen';
import {
  IVerifyPrescriptionScreenRouteProps,
  VerifyPrescriptionScreen,
} from '../../../screens/drug-search/verify-prescription/verify-prescription.screen';
import {
  IWhatComesNextRouteProps,
  WhatComesNextScreen,
} from '../../../screens/drug-search/what-comes-next/what-comes-next.screen';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import { RootStackNavigationProp } from '../root/root.stack-navigator';

export type DrugSearchStackParamList = {
  DrugSearchHome: undefined;
  DrugSearchPickAPharmacy: undefined;
  WhatComesNext: Partial<IWhatComesNextRouteProps>;
  PrescriptionTransferConfirmation: Partial<IPrescriptionTransferConfirmationRouteProps>;
  VerifyPrescription: Partial<IVerifyPrescriptionScreenRouteProps>;
  FindYourPharmacy: Partial<IFindYourPharmacyScreenRouteProps>;
  ConfigureMedication: undefined;
};
export type DrugSearchStackScreenName = keyof DrugSearchStackParamList;

// TODO: Sort this out.  This file is using RootStackNavigationProp from
// root.stack-navigator.tsx and root.stack-navigator.tsx is using DrugSearchStackScreenName
// & DrugSearchStackNavigator from this file.

type ScreenNavigationProp<TScreenName extends DrugSearchStackScreenName> =
  RootStackNavigationProp &
    StackNavigationProp<DrugSearchStackParamList, TScreenName>;

type ScreenRouteProp<TScreenName extends DrugSearchStackScreenName> = RouteProp<
  DrugSearchStackParamList,
  TScreenName
>;

export type DrugSearchHomeNavigationProp =
  ScreenNavigationProp<'DrugSearchHome'>;
export type DrugSearchRouteProp = ScreenRouteProp<'DrugSearchHome'>;

export type DrugSearchPickAPharmacyNavigationProp =
  ScreenNavigationProp<'DrugSearchPickAPharmacy'>;

export type DrugSearchWhatComesNextNavigationProp =
  ScreenNavigationProp<'WhatComesNext'>;
export type DrugSearchWhatComesNextRouteProp = ScreenRouteProp<'WhatComesNext'>;

export type PrescriptionTransferNavigationProp =
  ScreenNavigationProp<'PrescriptionTransferConfirmation'>;
export type PrescriptionTransferRouteProp =
  ScreenRouteProp<'PrescriptionTransferConfirmation'>;

export type VerifyPrescriptionNavigationProp =
  ScreenNavigationProp<'VerifyPrescription'>;
export type VerifyPrescriptionRouteProp = ScreenRouteProp<'VerifyPrescription'>;

export type FindYourPharmacyNavigationProp =
  ScreenNavigationProp<'FindYourPharmacy'>;
export type FindYourPharmacyRouteProp = ScreenRouteProp<'FindYourPharmacy'>;
export type ConfigureMedicationNavigationProp =
  ScreenNavigationProp<'ConfigureMedication'>;

export type DrugSearchStackNavigationProp = RootStackNavigationProp &
  StackNavigationProp<DrugSearchStackParamList, DrugSearchStackScreenName>;

export const DrugSearchStackNavigator = (): ReactElement => {
  const Stack = createStackNavigator<DrugSearchStackParamList>();

  return (
    <Stack.Navigator
      screenOptions={defaultStackNavigationScreenOptions}
      screenListeners={defaultScreenListeners}
    >
      <Stack.Screen name='DrugSearchHome' component={DrugSearchHomeScreen} />
      <Stack.Screen
        name='DrugSearchPickAPharmacy'
        component={DrugSearchPickAPharmacyScreen}
      />
      <Stack.Screen name='WhatComesNext' component={WhatComesNextScreen} />
      <Stack.Screen
        name='PrescriptionTransferConfirmation'
        component={PrescriptionTransferConfirmationScreen}
      />
      <Stack.Screen
        name='VerifyPrescription'
        component={VerifyPrescriptionScreen}
      />
      <Stack.Screen
        name='FindYourPharmacy'
        component={FindYourPharmacyScreen}
      />
      <Stack.Screen
        name='ConfigureMedication'
        component={ConfigureMedicationScreen}
      />
    </Stack.Navigator>
  );
};
