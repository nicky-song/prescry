// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { NotificationColor, PrimaryColor } from '../../../theming/colors';
import { PurpleScale } from '../../../theming/theme';

export interface IPharmacyTagListStyles {
  bestValueTagViewStyle: ViewStyle;
  bestValueLabelTextStyle: TextStyle;
  favoritedPharmacyTagViewStyle: ViewStyle;
  favoritedPharmacyLabelTextStyle: TextStyle;
  homeDeliveryTagViewStyle: ViewStyle;
  homeDeliveryLabelTextStyle: TextStyle;
}

export const pharmacyTagListStyles: IPharmacyTagListStyles = {
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
