// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { FadeView } from '../../screen-containers/fade-view/fade-view';
import { FavoritedPharmacyNotification } from '../favorited-pharmacy/favorited-pharmacy.notification';
import { FavoritingErrorNotification } from '../favoriting-error/favoriting-error.notification';
import { UnfavoritedPharmacyNotification } from '../unfavorited-pharmacy/unfavorited-pharmacy.notification';
import { UnfavoritingErrorNotification } from '../unfavoriting-error/unfavoriting-error.notification';
import { allFavoriteNotificationsStyles } from './all-favorite.notifications.styles';

export type FavoritingStatus = 'success' | 'error' | 'none';

export interface IAllFavoriteNotificationsProps {
  onNotificationClose: () => void;
  viewStyle?: StyleProp<ViewStyle>;
}

export const AllFavoriteNotifications = ({
  onNotificationClose,
  viewStyle,
}: IAllFavoriteNotificationsProps): ReactElement => {
  const {
    membershipState: { favoritingStatus, favoritingAction },
  } = useMembershipContext();

  const favoritingNotification =
    favoritingStatus === 'success' ? (
      favoritingAction === 'favoriting' ? (
        <FavoritedPharmacyNotification />
      ) : (
        <UnfavoritedPharmacyNotification />
      )
    ) : favoritingStatus === 'error' ? (
      favoritingAction === 'favoriting' ? (
        <FavoritingErrorNotification onClose={onNotificationClose} />
      ) : (
        <UnfavoritingErrorNotification onClose={onNotificationClose} />
      )
    ) : null;

  const fadingNotification = (
    <FadeView
      key={favoritingAction}
      style={allFavoriteNotificationsStyles.favoritingNotificationViewStyle}
      type='fade-out'
      onFinished={onNotificationClose}
    >
      {favoritingNotification}
    </FadeView>
  );

  const notification =
    favoritingStatus === 'success'
      ? fadingNotification
      : favoritingStatus === 'error'
      ? favoritingNotification
      : null;

  return <View style={viewStyle}>{notification}</View>;
};
