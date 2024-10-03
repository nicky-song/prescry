// Copyright 2022 Prescryptive Health, Inc.

import { NotificationColor, PrimaryColor } from '../../../theming/colors';
import { PurpleScale } from '../../../theming/theme';
import {
  pharmacyTagListStyles,
  IPharmacyTagListStyles,
} from './pharmacy-tag-list.styles';

describe('favoriteTagStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPharmacyTagListStyles = {
      bestValueTagViewStyle: {
        backgroundColor: NotificationColor.lightGreen,
      },
      bestValueLabelTextStyle: {
        color: NotificationColor.darkGreen,
      },
      favoritedPharmacyTagViewStyle: {
        backgroundColor: NotificationColor.lightRatings,
      },
      favoritedPharmacyLabelTextStyle: {
        color: PrimaryColor.darkBlue,
      },
      homeDeliveryTagViewStyle: {
        backgroundColor: PurpleScale.lighter,
      },
      homeDeliveryLabelTextStyle: {
        color: PurpleScale.darkest,
      },
    };

    expect(pharmacyTagListStyles).toEqual(expectedStyles);
  });
});
