// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { ITestContainer } from '../../../../../testing/test.container';
import { SideMenuDrawerNavigator } from './side-menu.drawer-navigator';
import { getChildren } from '../../../../../testing/test.helper';
import { defaultScreenListeners } from '../../navigation.helper';
import { RootStackNavigator } from '../../stack-navigators/root/root.stack-navigator';
import { sideMenuDrawerNavigatorStyles } from './side-menu.drawer-navigator.styles';
import { SideMenuDrawerContent } from './side-menu.drawer-content';
import { useDrawerContext } from '../../../context-providers/drawer/drawer.context.hook';

jest.mock('../../../context-providers/drawer/drawer.context.hook');
const useDrawerContextMock = useDrawerContext as jest.Mock;

jest.mock('@react-navigation/drawer');
const createDrawerNavigatorMock = createDrawerNavigator as jest.Mock;

jest.mock('../../stack-navigators/root/root.stack-navigator', () => ({
  RootStackNavigator: () => <div />,
}));

jest.mock('./side-menu.drawer-content', () => ({
  SideMenuDrawerContent: () => <div />,
}));

const DrawerNavigatorMock = {
  Navigator: ({ children }: ITestContainer) => <div>{children}</div>,
  Screen: () => <div />,
};

describe('SideMenuDrawerNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createDrawerNavigatorMock.mockReturnValue(DrawerNavigatorMock);
    useDrawerContextMock.mockReturnValue({ drawerState: { status: 'closed' } });
  });

  it('renders in DrawerNavigator', () => {
    const testRenderer = renderer.create(<SideMenuDrawerNavigator />);

    const drawerNavigator = testRenderer.root.children[0] as ReactTestInstance;

    expect(drawerNavigator.type).toEqual(DrawerNavigatorMock.Navigator);
    expect(drawerNavigator.props.screenOptions).toEqual({
      drawerPosition: 'right',
      headerShown: false,
      drawerStyle: sideMenuDrawerNavigatorStyles.drawerClosedViewStyle,
      gestureEnabled: false,
      swipeEnabled: false,
    });
    expect(drawerNavigator.props.screenListeners).toEqual(
      defaultScreenListeners
    );
    expect(drawerNavigator.props.drawerContent).toEqual(expect.any(Function));

    const drawerPropsMock = {
      stuff: 'stuff',
    } as unknown as DrawerContentComponentProps;
    expect(drawerNavigator.props.drawerContent(drawerPropsMock)).toEqual(
      <SideMenuDrawerContent {...drawerPropsMock} />
    );
  });

  it.each([
    ['open', sideMenuDrawerNavigatorStyles.drawerOpenViewStyle],
    ['closed', sideMenuDrawerNavigatorStyles.drawerClosedViewStyle],
  ])(
    'renders with expected drawer %s ViewStyle',
    (drawerStatus, expectedViewStyle) => {
      useDrawerContextMock.mockReturnValueOnce({
        drawerState: { status: drawerStatus },
      });

      const testRenderer = renderer.create(<SideMenuDrawerNavigator />);

      const drawerNavigator = testRenderer.root
        .children[0] as ReactTestInstance;

      expect(drawerNavigator.type).toEqual(DrawerNavigatorMock.Navigator);
      expect(drawerNavigator.props.screenOptions).toEqual({
        drawerPosition: 'right',
        headerShown: false,
        drawerStyle: expectedViewStyle,
        gestureEnabled: false,
        swipeEnabled: false,
      });
    }
  );

  it('renders screens', () => {
    const expectedScreens = [['RootStack', RootStackNavigator]];

    const testRenderer = renderer.create(<SideMenuDrawerNavigator />);

    const drawerNavigator = testRenderer.root.findByType(
      DrawerNavigatorMock.Navigator
    );
    const drawerScreens = getChildren(drawerNavigator);

    expect(drawerScreens.length).toEqual(expectedScreens.length);

    expectedScreens.forEach(([expectedName, expectedComponent], index) => {
      const screen = drawerScreens[index];

      expect(screen.type).toEqual(DrawerNavigatorMock.Screen);
      expect(screen.props.name).toEqual(expectedName);
      expect(screen.props.component).toEqual(expectedComponent);
    });
  });
});
