// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { ListItem } from '../../primitives/list-item';
import { BaseText } from '../../text/base-text/base-text';
import { BaseTag } from './base.tag';
import { baseTagStyles } from './base.tag.styles';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

describe('BaseTag', () => {
  it('renders as ListItem', () => {
    const viewStyleMock: ViewStyle = { width: 0 };
    const testRenderer = renderer.create(
      <BaseTag label='' viewStyle={viewStyleMock} testID='baseTag' />
    );

    const listItem = testRenderer.root.children[0] as ReactTestInstance;

    expect(listItem.type).toEqual(ListItem);
    expect(listItem.props.style).toEqual([
      baseTagStyles.viewStyle,
      viewStyleMock,
    ]);
    expect(listItem.props.testID).toEqual('baseTag');
    expect(getChildren(listItem).length).toEqual(2);
  });

  it.each([
    [undefined, undefined],
    ['star', IconSize.big],
  ])(
    'renders icon (iconName: %p)',
    (iconNameMock: undefined | string, iconSizeMock: undefined | number) => {
      const iconSolidMock = true;
      const iconTextStyleMock: TextStyle = {
        width: 1,
      };
      const iconColorMock = NotificationColor.heartRed;
      const testRenderer = renderer.create(
        <BaseTag
          label=''
          iconName={iconNameMock}
          iconSolid={iconSolidMock}
          iconTextStyle={iconTextStyleMock}
          iconColor={iconColorMock}
          iconSize={iconSizeMock}
          testID='baseTag'
        />
      );

      const listItem = testRenderer.root.children[0] as ReactTestInstance;
      const icon = getChildren(listItem)[0];

      if (!iconNameMock) {
        expect(icon).toBeNull();
      } else {
        expect(icon.type).toEqual(FontAwesomeIcon);
        expect(icon.props.name).toEqual(iconNameMock);
        expect(icon.props.style).toEqual([
          baseTagStyles.iconTextStyle,
          iconTextStyleMock,
        ]);
        expect(icon.props.solid).toEqual(iconSolidMock);
        expect(icon.props.color).toEqual(iconColorMock);
        expect(icon.props.size).toEqual(iconSizeMock ?? IconSize.smaller);
      }
    }
  );

  it('renders label', () => {
    const labelMock = 'label';
    const labelTextStyleMock: TextStyle = { color: 'purple' };
    const isSkeletonMock = true;

    const testRenderer = renderer.create(
      <BaseTag
        label={labelMock}
        labelTextStyle={labelTextStyleMock}
        isSkeleton={isSkeletonMock}
        testID='baseTag'
      />
    );

    const listItem = testRenderer.root.children[0] as ReactTestInstance;
    const label = getChildren(listItem)[1];

    expect(label.type).toEqual(BaseText);
    expect(label.props.isSkeleton).toEqual(isSkeletonMock);
    expect(label.props.style).toEqual([
      baseTagStyles.labelTextStyle,
      labelTextStyleMock,
    ]);
    expect(label.props.children).toEqual(labelMock);
  });
});
