// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { DrawerHamburgerButton } from '../drawer-hamburger/drawer-hamburger.button';
import { ProfileAvatar } from '../profile-avatar/profile-avatar';
import {
  drawerHamburgerAuthStyles,
  iconSize,
} from './drawer-hamburger-auth.button.styles';

export interface IDrawerHamburgerAuthButtonProps {
  onPress?: () => void;
  memberProfileName?: string;
  testID?: string;
}

export const DrawerHamburgerAuthButton: React.SFC<IDrawerHamburgerAuthButtonProps> =
  (props: IDrawerHamburgerAuthButtonProps) => {
    return props.memberProfileName ? (
      <TouchableOpacity
        style={drawerHamburgerAuthStyles.touchableOpacityContainerViewStyle}
        onPress={props.onPress}
        testID={props.testID}
      >
        <ProfileAvatar
          profileName={props.memberProfileName}
          viewStyle={drawerHamburgerAuthStyles.profileAvatarViewStyle}
        />
        <View style={drawerHamburgerAuthStyles.iconContainerViewStyle}>
          <FontAwesomeIcon
            name='bars'
            size={iconSize}
            color={PrimaryColor.prescryptivePurple}
            style={drawerHamburgerAuthStyles.iconTextStyle}
          />
        </View>
      </TouchableOpacity>
    ) : (
      <DrawerHamburgerButton onPress={props.onPress} testID={props.testID} />
    );
  };
