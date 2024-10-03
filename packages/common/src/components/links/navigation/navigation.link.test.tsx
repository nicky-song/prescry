// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle, TouchableOpacity, TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { NavigationLink } from './navigation.link';
import { navigationLinkStyles } from './navigation.link.styles';

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('NavigationLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [undefined, 'navigationLink'],
    ['test-id', 'test-id'],
  ])(
    'renders in TouchableOpacity (testID: %p)',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const viewStyleMock: ViewStyle = { width: 1 };
      const onPressMock = jest.fn();

      const testRenderer = renderer.create(
        <NavigationLink
          label=''
          viewStyle={viewStyleMock}
          onPress={onPressMock}
          testID={testIdMock}
        />
      );

      const touchableOpacity = testRenderer.root
        .children[0] as ReactTestInstance;

      expect(touchableOpacity.type).toEqual(TouchableOpacity);
      expect(touchableOpacity.props.accessibilityRole).toEqual('link');
      expect(touchableOpacity.props.style).toEqual([
        navigationLinkStyles.linkItemTextStyle,
        viewStyleMock,
      ]);
      expect(touchableOpacity.props.onPress).toEqual(onPressMock);
      expect(touchableOpacity.props.testID).toEqual(expectedTestId);
      expect(getChildren(touchableOpacity).length).toEqual(2);
    }
  );

  it.each([[undefined], ['blue']])(
    'renders link label with color %p',
    (linkColorMock: string | undefined) => {
      const labelMock = 'label';
      const isSkeletonMock = true;

      const testRenderer = renderer.create(
        <NavigationLink
          label={labelMock}
          linkColor={linkColorMock}
          isSkeleton={isSkeletonMock}
          onPress={jest.fn()}
        />
      );

      const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);

      const baseText = getChildren(touchableOpacity)[0];

      expect(baseText.type).toEqual(BaseText);

      const expectedColorTextStyle: TextStyle | undefined = linkColorMock
        ? { color: linkColorMock }
        : undefined;
      expect(baseText.props.style).toEqual([
        navigationLinkStyles.linkLabelTextStyle,
        expectedColorTextStyle,
      ]);

      expect(baseText.props.isSkeleton).toEqual(isSkeletonMock);
      expect(baseText.props.children).toEqual(labelMock);
    }
  );

  it('renders icon', () => {
    const testRenderer = renderer.create(
      <NavigationLink label='' onPress={jest.fn()} />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);

    const icon = getChildren(touchableOpacity)[1];

    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual('chevron-right');
    expect(icon.props.style).toEqual(navigationLinkStyles.iconTextStyle);
  });
});
