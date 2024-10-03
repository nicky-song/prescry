// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';

export interface ISideMenuDrawerNavigatorStyles {
  drawerOpenViewStyle: ViewStyle;
  drawerClosedViewStyle: ViewStyle;
}

export const sideMenuDrawerNavigatorStyles: ISideMenuDrawerNavigatorStyles = {
  drawerOpenViewStyle: { width: '100%' },
  drawerClosedViewStyle: { width: 0 },
};
