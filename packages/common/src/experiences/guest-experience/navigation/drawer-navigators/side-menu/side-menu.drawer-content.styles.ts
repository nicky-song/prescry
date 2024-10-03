// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../../../theming/spacing';
import {
  reactNavigationDrawerHeaderBottomMargin,
  reactNavigationDrawerItemVerticalPadding,
} from '../react-navigation-drawer.styles';

export interface ISideMenuDrawerContentStyles {
  scrollViewStyle: ViewStyle;
}

export const sideMenuDrawerContentStyles: ISideMenuDrawerContentStyles = {
  scrollViewStyle: {
    padding: Spacing.times1pt5,
    paddingTop: Spacing.times1pt5 - reactNavigationDrawerItemVerticalPadding,
    marginTop: -reactNavigationDrawerHeaderBottomMargin,
  },
};
