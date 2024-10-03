// Copyright 2022 Prescryptive Health, Inc.

import { NotificationColor } from '../../../theming/colors';
import {
  unfavoritingErrorNotificationStyles,
  IUnfavoritingErrorNotificationStyles,
} from './unfavoriting-error.notification.styles';

describe('unfavoritingErrorNotificationStyles', () => {
  it('has expected styles', () => {
    const expectedUnfavoritingErrorNotificationStyles: IUnfavoritingErrorNotificationStyles =
      {
        notificationViewStyle: {
          backgroundColor: NotificationColor.lightRed,
        },
      };

    expect(unfavoritingErrorNotificationStyles).toEqual(
      expectedUnfavoritingErrorNotificationStyles
    );
  });
});
