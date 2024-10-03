// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { GrayScaleColor, NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { BaseNotification } from './base.notification';
import { baseNotificationStyles } from './base.notification.styles';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

const messageMock = 'message-mock';
const onCloseMock = jest.fn();
const viewStyleMock: ViewStyle = { backgroundColor: 'purple' };
const iconNameMock = 'heart';
const iconSizeMock = IconSize.regular;
const iconColorMock = NotificationColor.heartRed;
const iconTextStyleMock: TextStyle = { color: 'purple' };
const iconSolidMock = true;
const isSkeletonMock = true;
const testIDMock = 'test-id-mock';

describe('BaseNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as expected View', () => {
    const testRenderer = renderer.create(
      <BaseNotification
        message={messageMock}
        onClose={onCloseMock}
        viewStyle={viewStyleMock}
        testID={testIDMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual([
      baseNotificationStyles.viewStyle,
      viewStyleMock,
    ]);
    expect(view.props.testID).toEqual(testIDMock);

    const children = getChildren(view);

    expect(children.length).toEqual(3);
  });

  it('renders expected icon in children first', () => {
    const testRenderer = renderer.create(
      <BaseNotification
        message={messageMock}
        onClose={onCloseMock}
        viewStyle={viewStyleMock}
        iconColor={iconColorMock}
        iconSize={iconSizeMock}
        iconName={iconNameMock}
        iconTextStyle={iconTextStyleMock}
        iconSolid={iconSolidMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const children = getChildren(view);
    const icon = children[0];

    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.style).toEqual([
      baseNotificationStyles.iconTextStyle,
      iconTextStyleMock,
    ]);
    expect(icon.props.name).toEqual(iconNameMock);
    expect(icon.props.color).toEqual(iconColorMock);
    expect(icon.props.size).toEqual(iconSizeMock);
    expect(icon.props.solid).toEqual(iconSolidMock);
  });

  it.each([
    [iconColorMock, iconSizeMock, undefined],
    [iconColorMock, undefined, iconNameMock],
    [undefined, iconSizeMock, iconNameMock],
    [iconColorMock, iconSizeMock, iconNameMock],
  ])(
    'renders icon as null if either iconColor, iconSize, or iconName is undefined',
    (
      iconColorInput: string | undefined,
      iconSizeInput: number | undefined,
      iconNameInput: string | undefined
    ) => {
      const testRenderer = renderer.create(
        <BaseNotification
          message={messageMock}
          onClose={onCloseMock}
          viewStyle={viewStyleMock}
          iconColor={iconColorInput}
          iconSize={iconSizeInput}
          iconName={iconNameInput}
          iconTextStyle={iconTextStyleMock}
          iconSolid={iconSolidMock}
        />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;
      const children = getChildren(view);
      const icon = children[0];

      if (
        iconColorInput === undefined ||
        iconSizeInput === undefined ||
        iconNameInput === undefined
      )
        expect(icon).toBeNull();
      else {
        expect(icon).not.toBeNull();
      }
    }
  );

  it('renders expected messageText in children second', () => {
    const messageTextStyleMock: TextStyle = { color: 'purple' };

    const testRenderer = renderer.create(
      <BaseNotification
        message={messageMock}
        onClose={onCloseMock}
        isSkeleton={isSkeletonMock}
        messageTextStyle={messageTextStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const children = getChildren(view);
    const messageText = children[1];

    expect(messageText.type).toEqual(BaseText);
    expect(messageText.props.isSkeleton).toEqual(isSkeletonMock);
    expect(messageText.props.style).toEqual([
      baseNotificationStyles.messageTextStyle,
      messageTextStyleMock,
    ]);
    expect(messageText.props.children).toEqual(messageMock);
  });

  it('renders expected closeButton in children third', () => {
    const testRenderer = renderer.create(
      <BaseNotification message={messageMock} onClose={onCloseMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const children = getChildren(view);
    const closeButton = children[2];

    expect(closeButton.type).toEqual(TouchableOpacity);
    expect(closeButton.props.onPress).toEqual(onCloseMock);
    expect(closeButton.props.style).toEqual(
      baseNotificationStyles.closeButtonViewStyle
    );
    expect(getChildren(closeButton).length).toEqual(1);

    const closeIcon = getChildren(closeButton)[0];

    expect(closeIcon.type).toEqual(FontAwesomeIcon);
    expect(closeIcon.props.name).toEqual('times');
    expect(closeIcon.props.solid).toEqual(true);
    expect(closeIcon.props.color).toEqual(GrayScaleColor.secondaryGray);
    expect(closeIcon.props.size).toEqual(IconSize.regular);
  });

  it('renders closeButton as null in children third if no onClose prop', () => {
    const testRenderer = renderer.create(
      <BaseNotification message={messageMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const children = getChildren(view);
    const closeButton = children[2];

    expect(closeButton).toBeNull();
  });
});
