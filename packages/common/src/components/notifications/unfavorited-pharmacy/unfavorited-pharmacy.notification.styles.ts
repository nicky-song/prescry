// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { NotificationColor } from '../../../theming/colors';

export interface IUnfavoritedPharmacyNotificationStyles {
  notificationViewStyle: ViewStyle;
}

export const unfavoritedPharmacyNotificationStyles: IUnfavoritedPharmacyNotificationStyles =
  {
    notificationViewStyle: {
      backgroundColor: NotificationColor.lightGreen,
    },
  };
