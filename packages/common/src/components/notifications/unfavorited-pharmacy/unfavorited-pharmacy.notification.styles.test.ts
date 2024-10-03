// Copyright 2022 Prescryptive Health, Inc.

import { NotificationColor } from '../../../theming/colors';
import {
  unfavoritedPharmacyNotificationStyles,
  IUnfavoritedPharmacyNotificationStyles,
} from './unfavorited-pharmacy.notification.styles';

describe('unfavoritedPharmacyNotificationStyles', () => {
  it('has expected styles', () => {
    const expectedUnfavoritedPharmacyNotificationStyles: IUnfavoritedPharmacyNotificationStyles =
      {
        notificationViewStyle: {
          backgroundColor: NotificationColor.lightGreen,
        },
      };

    expect(unfavoritedPharmacyNotificationStyles).toEqual(
      expectedUnfavoritedPharmacyNotificationStyles
    );
  });
});
