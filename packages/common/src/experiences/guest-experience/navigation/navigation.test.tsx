// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { Navigation } from './navigation';
import { ITestContainer } from '../../../testing/test.container';
import { getChildren } from '../../../testing/test.helper';
import { SideMenuDrawerNavigator } from './drawer-navigators/side-menu/side-menu.drawer-navigator';
import { DrawerContextProvider } from '../context-providers/drawer/drawer.context-provider';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual<Record<string, unknown>>('@react-navigation/native'),
  NavigationContainer: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('./drawer-navigators/side-menu/side-menu.drawer-navigator', () => ({
  SideMenuDrawerNavigator: () => <div />,
}));

describe('Navigation', () => {
  it('renders in DrawerContextProvider & NavigationContainer', () => {
    const testRenderer = renderer.create(<Navigation />);

    const drawerContextProvider = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(drawerContextProvider.type).toEqual(DrawerContextProvider);

    const container = drawerContextProvider.props.children;

    expect(container.type).toEqual(NavigationContainer);
    expect(getChildren(container).length).toEqual(1);
  });

  it('renders sidebar navigator', () => {
    const testRenderer = renderer.create(<Navigation />);

    const container = testRenderer.root.findByType(NavigationContainer);
    const drawerNavigator = getChildren(container)[0];

    expect(drawerNavigator.type).toEqual(SideMenuDrawerNavigator);
  });
});
