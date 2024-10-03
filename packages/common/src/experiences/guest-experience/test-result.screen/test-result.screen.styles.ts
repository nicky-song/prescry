// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface ITestResultScreenStyles {
  bodyViewStyle: ViewStyle;
  expanderViewStyle: ViewStyle;
}

export const testResultScreenStyles: ITestResultScreenStyles = {
  bodyViewStyle: {
    marginTop: Spacing.base,
  },
  expanderViewStyle: {
    marginLeft: -Spacing.times1pt5,
    marginRight: -Spacing.times1pt5,
  },
};
