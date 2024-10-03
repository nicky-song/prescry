// Copyright 2022 Prescryptive Health, Inc.

import { NotificationColor } from '../../../theming/colors';
import {
  setLanguageErrorNotificationStyles,
  ISetLanguageErrorNotificationStyles,
} from './set-language-error.notification.styles';

describe('setLanguageErrorNotificationStyles', () => {
  it('has expected styles', () => {
    const expectedFavoritedErrorNotificationStyles: ISetLanguageErrorNotificationStyles =
      {
        notificationViewStyle: {
          backgroundColor: NotificationColor.lightRed,
        },
      };

    expect(setLanguageErrorNotificationStyles).toEqual(
      expectedFavoritedErrorNotificationStyles
    );
  });
});
