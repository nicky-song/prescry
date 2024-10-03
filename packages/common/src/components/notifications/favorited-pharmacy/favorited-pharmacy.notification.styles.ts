// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { NotificationColor } from '../../../theming/colors';

export interface IFavoritedPharmacyNotificationStyles {
  notificationViewStyle: ViewStyle;
}

export const favoritedPharmacyNotificationStyles: IFavoritedPharmacyNotificationStyles =
  {
    notificationViewStyle: {
      backgroundColor: NotificationColor.lightGreen,
    },
  };
