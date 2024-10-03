// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export const containerWidth = 24;
export const iconSize = 14;

export interface IDrawerHamburgerAuthStyles {
  touchableOpacityContainerViewStyle: ViewStyle;
  profileAvatarViewStyle: ViewStyle;
  iconContainerViewStyle: ViewStyle;
  iconTextStyle: TextStyle;
}

const touchableOpacityContainerViewStyle: ViewStyle = {
  alignItems: 'center',
  flexDirection: 'row-reverse',
};

const profileAvatarViewStyle: ViewStyle = {
  marginRight: -Spacing.quarter,
};

const iconContainerViewStyle: ViewStyle = {
  backgroundColor: GrayScaleColor.white,
  borderRadius: containerWidth * 0.5,
  width: containerWidth,
  height: containerWidth,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: Spacing.times2pt5,
  marginRight: -Spacing.base,
};

const iconTextStyle: TextStyle = {
  maxHeight: iconSize,
  fontSize: iconSize,
};

export const drawerHamburgerAuthStyles: IDrawerHamburgerAuthStyles = {
  touchableOpacityContainerViewStyle,
  profileAvatarViewStyle,
  iconContainerViewStyle,
  iconTextStyle,
};
