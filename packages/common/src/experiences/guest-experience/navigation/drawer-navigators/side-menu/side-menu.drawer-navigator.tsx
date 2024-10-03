// Copyright 2022 Prescryptive Health, Inc.

import {
  createDrawerNavigator,
  DrawerNavigationProp,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import React, { ReactElement } from 'react';
import { useDrawerContext } from '../../../context-providers/drawer/drawer.context.hook';
import { defaultScreenListeners } from '../../navigation.helper';
import {
  RootStackNavigator,
  RootStackScreenName,
} from '../../stack-navigators/root/root.stack-navigator';
import { SideMenuDrawerContent } from './side-menu.drawer-content';
import { sideMenuDrawerNavigatorStyles } from './side-menu.drawer-navigator.styles';

export type SideMenuDrawerParamList = {
  RootStack: Partial<{
    screen: RootStackScreenName;
    params: unknown;
  }>;
};
export type SideMenuDrawerScreenName = keyof SideMenuDrawerParamList;

export type SideMenuDrawerNavigationProp =
  DrawerNavigationProp<SideMenuDrawerParamList>;

export const SideMenuDrawerNavigator = (): ReactElement => {
  const Drawer = createDrawerNavigator<SideMenuDrawerParamList>();

  const drawerContent = (props: DrawerContentComponentProps) => (
    <SideMenuDrawerContent {...props} />
  );

  const {
    drawerState: { status },
  } = useDrawerContext();

  const isDrawerOpen = status === 'open';

  const currentViewStyle = isDrawerOpen
    ? sideMenuDrawerNavigatorStyles.drawerOpenViewStyle
    : sideMenuDrawerNavigatorStyles.drawerClosedViewStyle;

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        gestureEnabled: false,
        swipeEnabled: false,
        drawerStyle: currentViewStyle,
      }}
      screenListeners={defaultScreenListeners}
      drawerContent={drawerContent}
    >
      <Drawer.Screen name='RootStack' component={RootStackNavigator} />
    </Drawer.Navigator>
  );
};
