// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import {
  DrawerHamburgerButton,
  IDrawerHamburgerButtonProps,
} from './drawer-hamburger.button';
import {
  iconSize,
  drawerHamburgerStyles,
} from './drawer-hamburger.button.styles';
import { PrimaryColor } from '../../../theming/colors';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

const targetMock = jest.fn();

const hamburgerButtonProps: IDrawerHamburgerButtonProps = {
  onPress: targetMock,
  testID: 'drawerHamburgerButtonTestIDMock',
};

afterEach(() => {
  targetMock.mockClear();
});

describe('DrawerHamburgerButton', () => {
  it('should open drawer menu on DrawerHamburgerButton click', () => {
    const hamburgerButton = renderer.create(
      <DrawerHamburgerButton {...hamburgerButtonProps} />
    );

    const props = hamburgerButton.root.findByType(TouchableOpacity)
      .props as IDrawerHamburgerButtonProps;
    expect(props.onPress).toBe(hamburgerButtonProps.onPress);
    expect(props.testID).toEqual(hamburgerButtonProps.testID);
  });

  it('renders hamburger menu icon correctly', () => {
    const hamburgerButton = renderer.create(
      <DrawerHamburgerButton {...hamburgerButtonProps} />
    );

    const hamburgerMenuIcon = hamburgerButton.root.findByType(FontAwesomeIcon);
    expect(hamburgerMenuIcon.props.name).toEqual('bars');
    expect(hamburgerMenuIcon.props.size).toEqual(iconSize);
    expect(hamburgerMenuIcon.props.color).toEqual(PrimaryColor.darkBlue);
    expect(hamburgerMenuIcon.props.style).toEqual(
      drawerHamburgerStyles.drawerHamburgerIconTextStyle
    );
  });
});
