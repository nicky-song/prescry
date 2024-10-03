// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { FavoritingAction } from '../../buttons/favorite-icon/favorite-icon.button';
import {
  AllFavoriteNotifications,
  IAllFavoriteNotificationsProps,
} from './all-favorite.notifications';
import { FadeView } from '../../screen-containers/fade-view/fade-view';
import { FavoritedPharmacyNotification } from '../favorited-pharmacy/favorited-pharmacy.notification';
import { FavoritingErrorNotification } from '../favoriting-error/favoriting-error.notification';
import { UnfavoritedPharmacyNotification } from '../unfavorited-pharmacy/unfavorited-pharmacy.notification';
import { UnfavoritingErrorNotification } from '../unfavoriting-error/unfavoriting-error.notification';
import { allFavoriteNotificationsStyles } from './all-favorite.notifications.styles';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';

jest.mock(
  '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook'
);
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../screen-containers/fade-view/fade-view', () => ({
  FadeView: () => <div />,
}));

jest.mock('../favorited-pharmacy/favorited-pharmacy.notification', () => ({
  FavoritedPharmacyNotification: () => <div />,
}));

jest.mock('../favoriting-error/favoriting-error.notification', () => ({
  FavoritingErrorNotification: () => <div />,
}));

jest.mock('../unfavorited-pharmacy/unfavorited-pharmacy.notification', () => ({
  UnfavoritedPharmacyNotification: () => <div />,
}));

jest.mock('../unfavoriting-error/unfavoriting-error.notification', () => ({
  UnfavoritingErrorNotification: () => <div />,
}));

describe('AllFavoriteNotification', () => {
  const defaultAllFavoriteNotificationProps: IAllFavoriteNotificationsProps = {
    onNotificationClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['favoriting' as FavoritingAction],
    ['unfavoriting' as FavoritingAction],
  ])(
    'renders FadeView with expected props during %s',
    (favoritingAction: FavoritingAction) => {
      useMembershipContextMock.mockReset();
      useMembershipContextMock.mockReturnValue({
        membershipState: {
          favoritingAction,
          favoritingStatus: 'success',
        },
      });

      const testRenderer = renderer.create(
        <AllFavoriteNotifications {...defaultAllFavoriteNotificationProps} />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      expect(getChildren(view).length).toEqual(1);

      const notification = getChildren(view)[0];

      expect(notification.type).toEqual(FadeView);
      expect(notification.props.style).toEqual(
        allFavoriteNotificationsStyles.favoritingNotificationViewStyle
      );
      expect(notification.props.type).toEqual('fade-out');
      expect(notification.props.onFinished).toEqual(
        defaultAllFavoriteNotificationProps.onNotificationClose
      );
    }
  );

  it('renders FavoritedPharmacyNotification on favoriting success', () => {
    useMembershipContextMock.mockReset();
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        favoritingStatus: 'success',
        favoritingAction: 'favoriting',
      },
    });

    const testRenderer = renderer.create(
      <AllFavoriteNotifications {...defaultAllFavoriteNotificationProps} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const notification = getChildren(view)[0];

    expect(notification.type).toEqual(FadeView);

    const favoritedNotification = getChildren(notification)[0];

    expect(favoritedNotification.type).toEqual(FavoritedPharmacyNotification);
  });

  it('renders UnfavoritedPharmacyNotification on favoriting success', () => {
    useMembershipContextMock.mockReset();
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        favoritingAction: 'unfavoriting',
        favoritingStatus: 'success',
      },
    });
    const testRenderer = renderer.create(
      <AllFavoriteNotifications {...defaultAllFavoriteNotificationProps} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const notification = getChildren(view)[0];

    expect(notification.type).toEqual(FadeView);

    const favoritedNotification = getChildren(notification)[0];

    expect(favoritedNotification.type).toEqual(UnfavoritedPharmacyNotification);
  });

  it('renders FavoritingErrorNotification on favoriting success', () => {
    useMembershipContextMock.mockReset();
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        favoritingAction: 'favoriting',
        favoritingStatus: 'error',
      },
    });

    const testRenderer = renderer.create(
      <AllFavoriteNotifications {...defaultAllFavoriteNotificationProps} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const notification = getChildren(view)[0];

    expect(notification.type).toEqual(FavoritingErrorNotification);
  });

  it('renders UnfavoritingErrorNotification on favoriting success', () => {
    useMembershipContextMock.mockReset();
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        favoritingAction: 'unfavoriting',
        favoritingStatus: 'error',
      },
    });

    const testRenderer = renderer.create(
      <AllFavoriteNotifications {...defaultAllFavoriteNotificationProps} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const notification = getChildren(view)[0];

    expect(notification.type).toEqual(UnfavoritingErrorNotification);
  });

  it.each([
    ['favoriting' as FavoritingAction],
    ['unfavoriting' as FavoritingAction],
  ])(
    'renders error notifications with expected onClose method during %s',
    (favoritingAction: FavoritingAction) => {
      useMembershipContextMock.mockReset();
      useMembershipContextMock.mockReturnValue({
        membershipState: {
          favoritingAction,
          favoritingStatus: 'error',
        },
      });

      const testRenderer = renderer.create(
        <AllFavoriteNotifications {...defaultAllFavoriteNotificationProps} />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      const notification = getChildren(view)[0];

      expect(notification.props.onClose).toEqual(
        defaultAllFavoriteNotificationProps.onNotificationClose
      );
    }
  );
});
