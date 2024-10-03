// Copyright 2022 Prescryptive Health, Inc.

import { NavigationContainer } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { DrawerContextProvider } from '../context-providers/drawer/drawer.context-provider';
import { SideMenuDrawerNavigator } from './drawer-navigators/side-menu/side-menu.drawer-navigator';

export const Navigation = (): ReactElement => (
  <DrawerContextProvider>
    <NavigationContainer>
      <SideMenuDrawerNavigator />
    </NavigationContainer>
  </DrawerContextProvider>
);
