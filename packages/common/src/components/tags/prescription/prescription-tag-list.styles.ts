// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { NotificationColor, PrimaryColor } from '../../../theming/colors';

export interface IPrescriptionTagListStyles {
  memberSavesTagViewStyle: ViewStyle;
  memberSavesTagTextStyle: TextStyle;
  planSavesTagViewStyle: ViewStyle;
  planSavesTagTextStyle: TextStyle;
}

export const prescriptionTagListStyles: IPrescriptionTagListStyles = {
  memberSavesTagViewStyle: {
    backgroundColor: NotificationColor.lightGreen,
  },
  memberSavesTagTextStyle: {
    color: NotificationColor.green,
  },
  planSavesTagViewStyle: {
    backgroundColor: PrimaryColor.lightPurple,
  },
  planSavesTagTextStyle: {
    color: PrimaryColor.prescryptivePurple,
  },
};
