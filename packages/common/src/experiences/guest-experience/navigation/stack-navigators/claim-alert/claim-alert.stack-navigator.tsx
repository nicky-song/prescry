// Copyright 2021 Prescryptive Health, Inc.

import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { ConnectedClaimAlertScreen } from '../../../claim-alert-screen/claim-alert-screen.connected';
import {
  ClaimExperienceScreen,
  IClaimExperienceScreenRouteProps,
} from '../../../screens/claim-experience/claim-experience.screen';
import { ClaimReversalScreen } from '../../../screens/claim-reversal/claim-reversal.screen';
import { GreatPriceScreen } from '../../../screens/great-price/great-price.screen';
import {
  IRecommendedAlternativesRouteProps,
  RecommendedAlternativesScreen,
} from '../../../screens/recommended-alternatives/recommended-alternatives.screen';
import {
  ISwitchYourMedicationRouteProps,
  SwitchYourMedicationScreen,
} from '../../../screens/switch-your-medication/switch-your-medication.screen';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import { RootStackNavigationProp } from '../root/root.stack-navigator';

export type ClaimAlertStackParamList = {
  ClaimAlert: undefined;
  RecommendedAlternatives: IRecommendedAlternativesRouteProps;
  SwitchYourMedication: ISwitchYourMedicationRouteProps;
  GreatPrice: undefined;
  ClaimExperience: IClaimExperienceScreenRouteProps;
  ClaimReversal: undefined;
};

export type ClaimAlertStackScreenName = keyof ClaimAlertStackParamList;

type ScreenNavigationProp<TScreenName extends ClaimAlertStackScreenName> =
  RootStackNavigationProp &
    StackNavigationProp<ClaimAlertStackParamList, TScreenName>;

type ScreenRouteProp<TScreenName extends ClaimAlertStackScreenName> = RouteProp<
  ClaimAlertStackParamList,
  TScreenName
>;

export type ClaimAlertNavigationProp = ScreenNavigationProp<'ClaimAlert'>;

export type ClaimAlertStackNavigationProp = RootStackNavigationProp &
  StackNavigationProp<ClaimAlertStackParamList, ClaimAlertStackScreenName>;

export type RecommendedAlternativesRouteProp =
  ScreenRouteProp<'RecommendedAlternatives'>;
export type RecommendedAlternativesNavigationProp =
  ScreenNavigationProp<'RecommendedAlternatives'>;

export type SwitchYourMedicationRouteProp =
  ScreenRouteProp<'SwitchYourMedication'>;
export type SwitchYourMedicationNavigationProp =
  ScreenNavigationProp<'SwitchYourMedication'>;

export type GreatPriceRouteProp = ScreenRouteProp<'GreatPrice'>;
export type GreatPriceNavigationProp = ScreenNavigationProp<'GreatPrice'>;

export type ClaimExperienceRouteProp = ScreenRouteProp<'ClaimExperience'>;
export type ClaimExperienceNavigationProp =
  ScreenNavigationProp<'ClaimExperience'>;

export type ClaimReversalRouteProp = ScreenRouteProp<'ClaimReversal'>;
export type ClaimReversalNavigationProp =
  ScreenNavigationProp<'ClaimExperience'>;

export const ClaimAlertStackNavigator = (): ReactElement => {
  const Stack = createStackNavigator<ClaimAlertStackParamList>();

  return (
    <Stack.Navigator
      screenOptions={defaultStackNavigationScreenOptions}
      screenListeners={defaultScreenListeners}
    >
      <Stack.Screen name='ClaimAlert' component={ConnectedClaimAlertScreen} />
      <Stack.Screen
        name='RecommendedAlternatives'
        component={RecommendedAlternativesScreen}
      />
      <Stack.Screen
        name='SwitchYourMedication'
        component={SwitchYourMedicationScreen}
      />
      <Stack.Screen name='GreatPrice' component={GreatPriceScreen} />
      <Stack.Screen name='ClaimExperience' component={ClaimExperienceScreen} />
      <Stack.Screen name='ClaimReversal' component={ClaimReversalScreen} />
    </Stack.Navigator>
  );
};
