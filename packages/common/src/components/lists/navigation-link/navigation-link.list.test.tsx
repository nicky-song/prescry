// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren, getKey } from '../../../testing/test.helper';
import { NavigationLink } from '../../links/navigation/navigation.link';
import { List } from '../../primitives/list';
import { ListItem } from '../../primitives/list-item';
import { NavigationView } from '../../primitives/navigation-view';
import { INavigationLink, NavigationLinkList } from './navigation-link.list';

jest.mock('../../links/navigation/navigation.link', () => ({
  NavigationLink: () => <div />,
}));

describe('NavigationLinkList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders in NavigationView', () => {
    const viewStyleMock: ViewStyle = { width: 1 };

    const testRenderer = renderer.create(
      <NavigationLinkList viewStyle={viewStyleMock} links={[]} />
    );

    const navigationView = testRenderer.root.children[0] as ReactTestInstance;

    expect(navigationView.type).toEqual(NavigationView);
    expect(navigationView.props.style).toEqual(viewStyleMock);
    expect(navigationView.props.testID).toEqual('navigationLinkList');
  });

  it.each([[[]], [[{ key: '', label: '', onPress: jest.fn() }]]])(
    'renders list container (links: %p)',
    (linksMock: INavigationLink[]) => {
      const testRenderer = renderer.create(
        <NavigationLinkList links={linksMock} />
      );

      const navigationView = testRenderer.root.findByType(NavigationView);
      const children = getChildren(navigationView);

      if (linksMock.length === 0) {
        expect(children.length).toEqual(0);
      } else {
        expect(children.length).toEqual(1);

        const list = children[0];
        expect(list.type).toEqual(List);
      }
    }
  );

  it('renders list items', () => {
    const linksMock: INavigationLink[] = [
      { key: 'label1', label: 'label-1', onPress: jest.fn() },
      { key: 'label2', label: 'label-2', onPress: jest.fn() },
    ];

    const testRenderer = renderer.create(
      <NavigationLinkList links={linksMock} />
    );

    const list = testRenderer.root.findByType(List);
    const listItems = getChildren(list);

    expect(listItems.length).toEqual(linksMock.length);
    listItems.forEach((listItem, index) => {
      const linkMock = linksMock[index];

      expect(listItem.type).toEqual(ListItem);
      expect(getKey(listItem)).toEqual(linkMock.key);
      expect(getChildren(listItem).length).toEqual(1);
    });
  });

  it('renders navigtion links', () => {
    const linksMock: INavigationLink[] = [
      { key: 'label1', label: 'label-1', onPress: jest.fn() },
      { key: 'label2', label: 'label-2', onPress: jest.fn() },
    ];

    const testRenderer = renderer.create(
      <NavigationLinkList links={linksMock} />
    );

    const listItems = testRenderer.root.findAllByType(ListItem);

    listItems.forEach((listItem, index) => {
      const linkMock = linksMock[index];
      const navigationLink = getChildren(listItem)[0];

      expect(navigationLink.type).toEqual(NavigationLink);
      expect(navigationLink.props.label).toEqual(linkMock.label);
      expect(navigationLink.props.testID).toEqual(
        `navigationLinkList-${linkMock.key}`
      );
      expect(navigationLink.props.onPress).toEqual(linkMock.onPress);
      expect(navigationLink.props.isSkeleton).toEqual(linkMock.isSkeleton);
    });
  });
});
