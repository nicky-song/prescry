// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren, getKey } from '../../../testing/test.helper';
import { List } from '../../primitives/list';
import { BaseTag, IBaseTagProps } from '../../tags/base/base.tag';
import { TagList } from './tag.list';
import { tagListStyles } from './tag.list.styles';

jest.mock('../../tags/base/base.tag', () => ({
  BaseTag: () => <div />,
}));

describe('TagList', () => {
  it('renders as List', () => {
    const viewStyleMock: ViewStyle = { width: 1 };
    const tagsMock: IBaseTagProps[] = [{ label: 'tag' }];

    const testRenderer = renderer.create(
      <TagList viewStyle={viewStyleMock} tags={tagsMock} />
    );

    const list = testRenderer.root.children[0] as ReactTestInstance;

    expect(list.type).toEqual(List);
    expect(list.props.style).toEqual([tagListStyles.viewStyle, viewStyleMock]);
    expect(list.props.testID).toEqual('tagList');
    expect(getChildren(list).length).toEqual(tagsMock.length);
  });

  it('renders tags', () => {
    const tag1Mock: IBaseTagProps = {
      label: 'tag-1',
      iconName: 'icon-1',
      iconSolid: false,
      iconTextStyle: { width: 11 },
      isSkeleton: false,
      viewStyle: { width: 12 },
    };
    const tag2Mock: IBaseTagProps = {
      label: 'tag-2',
      iconName: 'icon-2',
      iconSolid: false,
      iconTextStyle: { width: 21 },
      isSkeleton: false,
      viewStyle: { width: 22 },
    };
    const tagsMock: IBaseTagProps[] = [tag1Mock, tag2Mock];

    const testRenderer = renderer.create(<TagList tags={tagsMock} />);

    const list = testRenderer.root.findByProps({ testID: 'tagList' });
    const listChildren = getChildren(list);

    listChildren.forEach((child, index) => {
      const tagProps = tagsMock[index];

      expect(child.type).toEqual(BaseTag);
      expect(getKey(child)).toEqual(tagProps.label);
      expect(child.props).toEqual(tagProps);
    });
  });
});
