// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { NotificationColor } from '../../../theming/colors';

export interface IFavoritingErrorNotificationStyles {
  notificationViewStyle: ViewStyle;
}

export const favoritingErrorNotificationStyles: IFavoritingErrorNotificationStyles =
  {
    notificationViewStyle: {
      backgroundColor: NotificationColor.lightRed,
    },
  };
