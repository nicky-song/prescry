// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';

export const containerWidth = 36;
export const iconSize = 16;

export interface IDrawerHamburgerStyles {
  drawerHamburgerIconTextStyle: TextStyle;
  drawerHamburgerViewStyle: ViewStyle;
}

const drawerHamburgerIconTextStyle: TextStyle = {
  maxHeight: iconSize,
  fontSize: iconSize,
  paddingLeft: 1,
};

const drawerHamburgerViewStyle: ViewStyle = {
  backgroundColor: GrayScaleColor.lightGray,
  borderRadius: containerWidth * 0.5,
  width: containerWidth,
  height: containerWidth,
  alignItems: 'center',
  justifyContent: 'center',
};

export const drawerHamburgerStyles: IDrawerHamburgerStyles = {
  drawerHamburgerIconTextStyle,
  drawerHamburgerViewStyle,
};
