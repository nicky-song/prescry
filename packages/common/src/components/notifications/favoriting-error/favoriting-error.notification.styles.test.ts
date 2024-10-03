// Copyright 2022 Prescryptive Health, Inc.

import { NotificationColor } from '../../../theming/colors';
import {
  favoritingErrorNotificationStyles,
  IFavoritingErrorNotificationStyles,
} from './favoriting-error.notification.styles';

describe('favoritingErrorNotificationStyles', () => {
  it('has expected styles', () => {
    const expectedFavoritedErrorNotificationStyles: IFavoritingErrorNotificationStyles =
      {
        notificationViewStyle: {
          backgroundColor: NotificationColor.lightRed,
        },
      };

    expect(favoritingErrorNotificationStyles).toEqual(
      expectedFavoritedErrorNotificationStyles
    );
  });
});
