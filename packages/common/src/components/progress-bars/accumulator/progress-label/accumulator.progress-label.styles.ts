// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';

export interface IAccumulatorProgressLabelStyles {
  labelTextStyle: TextStyle;
}

export const accumulatorProgressLabelStyles: IAccumulatorProgressLabelStyles = {
  labelTextStyle: {
    marginBottom: Spacing.quarter,
  },
};
