// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import {
  DrawerHamburgerAuthButton,
  IDrawerHamburgerAuthButtonProps,
} from './drawer-hamburger-auth.button';
import {
  iconSize,
  drawerHamburgerAuthStyles,
} from './drawer-hamburger-auth.button.styles';
import { PrimaryColor } from '../../../theming/colors';
import { TouchableOpacity, View } from 'react-native';
import { ProfileAvatar } from '../profile-avatar/profile-avatar';
import { DrawerHamburgerButton } from '../drawer-hamburger/drawer-hamburger.button';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

const targetMock = jest.fn();

const memberProfileNameMock = 'member-profile-name-mock';

const hamburgerButtonProps: IDrawerHamburgerAuthButtonProps = {
  onPress: targetMock,
  memberProfileName: memberProfileNameMock,
  testID: 'drawerHamburgerAuthButtonTestIDMock',
};

describe('DrawerHamburgerAuthButton', () => {
  it('should open drawer menu on DrawerHamburgerButton click', () => {
    const hamburgerButton = renderer.create(
      <DrawerHamburgerAuthButton {...hamburgerButtonProps} />
    );

    const props = hamburgerButton.root.findByType(TouchableOpacity).props;
    expect(props.style).toBe(
      drawerHamburgerAuthStyles.touchableOpacityContainerViewStyle
    );
    expect(props.onPress).toBe(hamburgerButtonProps.onPress);
    expect(props.testID).toEqual(hamburgerButtonProps.testID);
  });

  it('renders hamburger menu icon correctly when member profile name is defined', () => {
    const hamburgerButton = renderer.create(
      <DrawerHamburgerAuthButton {...hamburgerButtonProps} />
    );

    const profileAvatar =
      hamburgerButton.root.findByType(TouchableOpacity).props.children[0];
    expect(profileAvatar.type).toEqual(ProfileAvatar);
    expect(profileAvatar.props.profileName).toEqual(memberProfileNameMock);
    expect(profileAvatar.props.viewStyle).toEqual(
      drawerHamburgerAuthStyles.profileAvatarViewStyle
    );

    const viewContainer =
      hamburgerButton.root.findByType(TouchableOpacity).props.children[1];
    expect(viewContainer.type).toEqual(View);
    expect(viewContainer.props.style).toEqual(
      drawerHamburgerAuthStyles.iconContainerViewStyle
    );

    const hamburgerMenuIcon = viewContainer.props.children;
    expect(hamburgerMenuIcon.type).toEqual(FontAwesomeIcon);
    expect(hamburgerMenuIcon.props.name).toEqual('bars');
    expect(hamburgerMenuIcon.props.size).toEqual(iconSize);
    expect(hamburgerMenuIcon.props.color).toEqual(
      PrimaryColor.prescryptivePurple
    );
    expect(hamburgerMenuIcon.props.style).toEqual(
      drawerHamburgerAuthStyles.iconTextStyle
    );
  });

  it('renders hamburger menu icon correctly when member profile name is NOT defined', () => {
    const hamburgerButton = renderer.create(
      <DrawerHamburgerAuthButton
        onPress={targetMock}
        memberProfileName={undefined}
        testID={hamburgerButtonProps.testID}
      />
    );

    const drawerHamburgerButton = hamburgerButton.root
      .children[0] as ReactTestInstance;

    expect(drawerHamburgerButton.type).toEqual(DrawerHamburgerButton);
    expect(drawerHamburgerButton.props.onPress).toBe(
      hamburgerButtonProps.onPress
    );
    expect(drawerHamburgerButton.props.testID).toEqual(
      hamburgerButtonProps.testID
    );
  });
});
