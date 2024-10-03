// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { DrawerItem } from '@react-navigation/drawer';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { SideMenuDrawerItem } from './side-menu.drawer-item';
import { sideMenuDrawerItemStyles } from './side-menu.drawer-item.styles';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { View } from 'react-native';
import { getChildren } from '../../../../../../testing/test.helper';
import { FontAwesomeIcon } from '../../../../../../components/icons/font-awesome/font-awesome.icon';

jest.mock('@react-navigation/drawer', () => ({
  DrawerItem: () => <div />,
}));

jest.mock(
  '../../../../../../components/icons/font-awesome/font-awesome.icon',
  () => ({
    FontAwesomeIcon: () => <div />,
  })
);

describe('SideMenuDrawerItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as DrawerItem', () => {
    const onPressMock = jest.fn();
    const testRenderer = renderer.create(
      <SideMenuDrawerItem
        label='label'
        iconName='icon-name'
        iconSize={1}
        onPress={onPressMock}
      />
    );

    const drawerItem = testRenderer.root.children[0] as ReactTestInstance;
    expect(drawerItem.type).toEqual(DrawerItem);
    expect(drawerItem.props.label).toEqual(expect.any(Function));
    expect(drawerItem.props.icon).toEqual(expect.any(Function));
    expect(drawerItem.props.onPress).toEqual(onPressMock);
    expect(drawerItem.props.style).toEqual(
      sideMenuDrawerItemStyles.itemViewStyle
    );
  });

  it('renders label', () => {
    const labelMock = 'label';
    const isSkeletonMock = false;
    const testRenderer = renderer.create(
      <SideMenuDrawerItem
        label={labelMock}
        iconName='icon-name'
        iconSize={1}
        onPress={jest.fn()}
        isSkeleton={isSkeletonMock}
      />
    );

    const drawerItem = testRenderer.root.findByType(DrawerItem);
    const baseText = drawerItem.props.label();

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(
      sideMenuDrawerItemStyles.labelTextStyle
    );
    expect(baseText.props.children).toEqual(labelMock);
  });

  it('renders icon', () => {
    const iconNameMock = 'icon-name';
    const iconSizeMock = 1;
    const iconContainerTestMock = 'iconContainertestID';

    const testRenderer = renderer.create(
      <SideMenuDrawerItem
        label='label'
        iconName={iconNameMock}
        iconSize={iconSizeMock}
        testID={iconContainerTestMock}
        onPress={jest.fn()}
      />
    );

    const drawerItem = testRenderer.root.findByType(DrawerItem);
    const iconContainer = drawerItem.props.icon();

    expect(iconContainer.type).toEqual(View);
    expect(iconContainer.props.style).toEqual(
      sideMenuDrawerItemStyles.iconViewStyle
    );
    expect(iconContainer.props.testID).toEqual(iconContainerTestMock);
    expect(getChildren(iconContainer).length).toEqual(1);

    const icon = getChildren(iconContainer)[0];

    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual(iconNameMock);
    expect(icon.props.size).toEqual(iconSizeMock);
  });
});
