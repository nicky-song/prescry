// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import {
  drawerHamburgerStyles,
  iconSize,
} from './drawer-hamburger.button.styles';

export interface IDrawerHamburgerButtonProps {
  onPress?: () => void;
  testID?: string;
}

export const DrawerHamburgerButton: React.SFC<IDrawerHamburgerButtonProps> = (
  props: IDrawerHamburgerButtonProps
) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={drawerHamburgerStyles.drawerHamburgerViewStyle}
      testID={props.testID}
    >
      <FontAwesomeIcon
        name='bars'
        size={iconSize}
        color={PrimaryColor.darkBlue}
        style={drawerHamburgerStyles.drawerHamburgerIconTextStyle}
      />
    </TouchableOpacity>
  );
};
