// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { DrawerItem } from '@react-navigation/drawer';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { SideMenuDrawerItem } from './side-menu.drawer-item';
import { LanguageSideMenuDrawerItem } from './language.side-menu.drawer-item';
import { languageSideMenuDrawerItemStyles as itemStyles } from './language.side-menu.drawer-item.styles';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { ProtectedBaseText } from '../../../../../../components/text/protected-base-text/protected-base-text';
import { View } from 'react-native';
import { getChildren } from '../../../../../../testing/test.helper';

jest.mock('@react-navigation/drawer', () => ({
  DrawerItem: () => <div />,
}));

jest.mock(
  '../../../../../../components/icons/font-awesome/font-awesome.icon',
  () => ({
    FontAwesomeIcon: () => <div />,
  })
);

describe('LanguageSideMenuDrawerItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as SideMenuDrawerItem', () => {
    const onPressMock = jest.fn();
    const isSkeletonMock = false;
    
    const testRenderer = renderer.create(
      <LanguageSideMenuDrawerItem
        label='Language'
        languageName='English'
        onPress={onPressMock}
        isSkeleton={isSkeletonMock}
      />
    );

    const drawerItem = testRenderer.root.children[0] as ReactTestInstance;

    expect(drawerItem.type).toEqual(SideMenuDrawerItem);
    expect(drawerItem.props.iconName).toEqual('globe');
    expect(drawerItem.props.iconSize).toEqual(18);
    expect(drawerItem.props.onPress).toEqual(onPressMock);
    expect(drawerItem.props.isSkeleton).toEqual(isSkeletonMock);
  });

  it('renders label container for language', () => {
    const labelMock = 'Language';
    const languageNameMock = 'English';
    const onPressMock = jest.fn();
    
    const testRenderer = renderer.create(
      <LanguageSideMenuDrawerItem
        label={labelMock}
        languageName={languageNameMock}
        onPress={onPressMock}
      />
    );

    const drawerItem = testRenderer.root.findByType(DrawerItem);
    const labelView = drawerItem.props.label();

    expect(labelView.type).toEqual(View);
    expect(labelView.props.style).toEqual(itemStyles.itemLabelViewStyle);
    expect(getChildren(labelView).length).toEqual(3);
  });

  it('renders label text for language and a dot', () => {
    const labelMock = 'Language';
    const languageNameMock = 'English';
    const onPressMock = jest.fn();
    
    const testRenderer = renderer.create(
      <LanguageSideMenuDrawerItem
        label={labelMock}
        languageName={languageNameMock}
        onPress={onPressMock}
      />
    );

    const drawerItem = testRenderer.root.findByType(DrawerItem);
    const labelView = drawerItem.props.label();
    const labelText = getChildren(labelView)[0];

    expect(labelText.type).toEqual(BaseText);
    expect(labelText.props.style).toEqual(itemStyles.labelTextStyle);
    expect(labelText.props.children).toEqual(labelMock);

    const labelDot = getChildren(labelView)[1];

    expect(labelDot.type).toEqual(ProtectedBaseText);
    expect(labelDot.props.style).toEqual(itemStyles.labelDotTextStyle);
    expect(labelDot.props.children).toEqual(' · ');
  });

  it('renders label language name', () => {
    const labelMock = 'Language';
    const languageNameMock = 'English';
    const onPressMock = jest.fn();
    
    const testRenderer = renderer.create(
      <LanguageSideMenuDrawerItem
        label={labelMock}
        languageName={languageNameMock}
        onPress={onPressMock}
      />
    );

    const drawerItem = testRenderer.root.findByType(DrawerItem);
    const labelView = drawerItem.props.label();
    const languageNameText = getChildren(labelView)[2];

    expect(languageNameText.type).toEqual(BaseText);
    expect(languageNameText.props.children).toEqual(languageNameMock);
  });
});
