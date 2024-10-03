// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IVaccinationRecordScreenStyles {
  expanderViewStyle: ViewStyle;
  moreInfoTextStyle: TextStyle;
}

export const vaccinationRecordScreenStyles: IVaccinationRecordScreenStyles = {
  expanderViewStyle: {
    marginLeft: -Spacing.times1pt5,
    marginRight: -Spacing.times1pt5,
  },
  moreInfoTextStyle: {
    marginTop: Spacing.threeQuarters,
  },
};
