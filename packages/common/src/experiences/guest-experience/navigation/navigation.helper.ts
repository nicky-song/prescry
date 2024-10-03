// Copyright 2021 Prescryptive Health, Inc.

import {
  EventMapBase,
  NavigationState,
  ParamListBase,
  RouteProp,
  ScreenListeners,
} from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { logNavigationEvent } from '../guest-experience-logger.middleware';
import { SideMenuDrawerScreenName } from './drawer-navigators/side-menu/side-menu.drawer-navigator';
import {
  RootStackNavigationProp,
  RootStackScreenName,
} from './stack-navigators/root/root.stack-navigator';

const defaultScreenTitle =
  'myPrescryptive | Prescription Management, Savings, & Pharmacy Information';

export const defaultStackNavigationScreenOptions: StackNavigationOptions = {
  headerShown: false,
  title: defaultScreenTitle,
};

export const getCurrentScreen = (
  navigation: RootStackNavigationProp
): RootStackScreenName | SideMenuDrawerScreenName => {
  const navigationState = navigation.getState();
  return navigationState.routes[navigationState.index].name;
};

export interface IListenerProps {
  navigation: unknown;
  route: RouteProp<ParamListBase>;
}

export const defaultScreenListeners = ({
  route,
}: IListenerProps): ScreenListeners<NavigationState, EventMapBase> => {
  return {
    state: (_e: unknown) => {
      logNavigationEvent(route.name);
    },
  };
};

export const popToTop = (navigation: RootStackNavigationProp): void => {
  if (navigation.canGoBack()) {
    navigation.popToTop();
  }
};
