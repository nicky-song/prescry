// Copyright 2022 Prescryptive Health, Inc.

import { NotificationColor } from '../../../theming/colors';
import {
  favoritedPharmacyNotificationStyles,
  IFavoritedPharmacyNotificationStyles,
} from './favorited-pharmacy.notification.styles';

describe('favoritedPharmacyNotificationStyles', () => {
  it('has expected styles', () => {
    const expectedFavoritedPharmacyNotificationStyles: IFavoritedPharmacyNotificationStyles =
      {
        notificationViewStyle: {
          backgroundColor: NotificationColor.lightGreen,
        },
      };

    expect(favoritedPharmacyNotificationStyles).toEqual(
      expectedFavoritedPharmacyNotificationStyles
    );
  });
});
