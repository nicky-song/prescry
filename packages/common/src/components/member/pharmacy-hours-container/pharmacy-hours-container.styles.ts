// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IPharmacyHoursContainerStyles {
  subContainerViewStyle: ViewStyle;
  pharmacyDayViewStyle: ViewStyle;
  hoursTextStyle: TextStyle;
  pharmacyHoursViewStyle: ViewStyle;
}
export const pharmacyHoursContainerStyles: IPharmacyHoursContainerStyles = {
  subContainerViewStyle: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingBottom: Spacing.half,
  },
  hoursTextStyle: {
    textAlign: 'right',
  },
  pharmacyDayViewStyle: {
    flexGrow: 0,
  },
  pharmacyHoursViewStyle: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
};
