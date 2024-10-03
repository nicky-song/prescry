// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';
import {
  reactNavigationDrawerItemLabelLeftMargin,
  reactNavigationDrawerItemVerticalPadding,
} from '../../react-navigation-drawer.styles';

export interface ISideMenuDrawerItemStyles {
  iconViewStyle: ViewStyle;
  itemViewStyle: ViewStyle;
  labelTextStyle: TextStyle;
  lineSeparatorViewStyle: ViewStyle;
}

export const sideMenuDrawerItemStyles: ISideMenuDrawerItemStyles = {
  iconViewStyle: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemViewStyle: {
    marginHorizontal: -8,
    marginVertical: 0,
  },
  labelTextStyle: {
    marginLeft: Spacing.times1pt5 - reactNavigationDrawerItemLabelLeftMargin,
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
  lineSeparatorViewStyle: {
    marginTop: Spacing.times1pt5 - reactNavigationDrawerItemVerticalPadding,
    marginBottom: Spacing.times1pt5 - reactNavigationDrawerItemVerticalPadding,
  },
};
