// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { NotificationColor } from '../../../theming/colors';

export interface IUnfavoritingErrorNotificationStyles {
  notificationViewStyle: ViewStyle;
}

export const unfavoritingErrorNotificationStyles: IUnfavoritingErrorNotificationStyles =
  {
    notificationViewStyle: {
      backgroundColor: NotificationColor.lightRed,
    },
  };
