// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { NotificationColor } from '../../../theming/colors';

export interface ISetLanguageErrorNotificationStyles {
  notificationViewStyle: ViewStyle;
}

export const setLanguageErrorNotificationStyles: ISetLanguageErrorNotificationStyles =
  {
    notificationViewStyle: {
      backgroundColor: NotificationColor.lightRed,
    },
  };
