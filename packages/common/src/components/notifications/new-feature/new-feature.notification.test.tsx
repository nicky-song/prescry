// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { ReactTestInstance } from 'react-test-renderer';
import { NewFeatureNotification } from './new-feature.notification';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { BaseNotification } from '../base/base.notification';
import { getChildren } from '../../../testing/test.helper';
import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../base/base.notification', () => ({
  BaseNotification: () => <div />,
}));

const onCloseMock = jest.fn();

describe('NewFeatureNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: {
        newFavoritedPharmaciesFeature: 'new-favorited-pharmacies-feature-mock',
      },
    });
  });

  it('renders as expected View', () => {
    const viewStyleMock: ViewStyle = { backgroundColor: 'purple' };

    const testRenderer = renderer.create(
      <NewFeatureNotification viewStyle={viewStyleMock} onClose={onCloseMock} />
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
      <NewFeatureNotification
        viewStyle={viewStyleMock}
        notificationViewStyle={notificationViewStyleMock}
        onClose={onCloseMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const baseNotification = getChildren(view)[0];

    expect(baseNotification.props.message).toEqual(
      'new-favorited-pharmacies-feature-mock'
    );
    expect(baseNotification.props.onClose).toEqual(expect.any(Function));
    expect(baseNotification.props.iconName).toEqual('heart');
    expect(baseNotification.props.iconColor).toEqual(
      NotificationColor.heartRed
    );
    expect(baseNotification.props.iconSize).toEqual(IconSize.regular);
    expect(baseNotification.props.viewStyle).toEqual(notificationViewStyleMock);
    expect(baseNotification.props.isSkeleton).toEqual(false);
  });

  it('calls onClose prop on BaseNotification onClose call', () => {
    const onCloseMock = jest.fn();

    const testRenderer = renderer.create(
      <NewFeatureNotification onClose={onCloseMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const baseNotification = getChildren(view)[0];

    expect(baseNotification.props.onClose).toEqual(onCloseMock);

    baseNotification.props.onClose();

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
