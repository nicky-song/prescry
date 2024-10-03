// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { ReactTestInstance } from 'react-test-renderer';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { BaseNotification } from '../base/base.notification';
import { getChildren } from '../../../testing/test.helper';
import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { SetLanguageErrorNotification } from './set-language-error.notification';
import { setLanguageErrorNotificationStyles } from './set-language-error.notification.styles';

jest.mock('../base/base.notification', () => ({
  BaseNotification: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const setLanguageErrorMock = 'set-language-error-mock';

const onCloseMock = jest.fn();

describe('SetLanguageErrorNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: { setLanguageError: setLanguageErrorMock },
    });
  });

  it('renders as expected View', () => {
    const viewStyleMock: ViewStyle = { backgroundColor: 'purple' };

    const testRenderer = renderer.create(
      <SetLanguageErrorNotification
        onClose={onCloseMock}
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(viewStyleMock);
    expect(getChildren(view).length).toEqual(1);

    const baseNotification = getChildren(view)[0];

    expect(baseNotification.type).toEqual(BaseNotification);
  });

  it('renders BaseNotification as expected by default', () => {
    const viewStyleMock: ViewStyle = { backgroundColor: 'purple' };
    const notificationViewStyleMock: ViewStyle = { borderColor: 'white' };

    const testRenderer = renderer.create(
      <SetLanguageErrorNotification
        onClose={onCloseMock}
        viewStyle={viewStyleMock}
        notificationViewStyle={notificationViewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const baseNotification = getChildren(view)[0];

    expect(baseNotification.props.message).toEqual(
      setLanguageErrorMock
    );
    expect(baseNotification.props.iconName).toEqual('exclamation-circle');
    expect(baseNotification.props.iconColor).toEqual(NotificationColor.red);
    expect(baseNotification.props.iconSize).toEqual(IconSize.regular);
    expect(baseNotification.props.viewStyle).toEqual([
      setLanguageErrorNotificationStyles.notificationViewStyle,
      notificationViewStyleMock,
    ]);
    expect(baseNotification.props.isSkeleton).toEqual(false);
    expect(baseNotification.props.onClose).toEqual(onCloseMock);
  });
});
