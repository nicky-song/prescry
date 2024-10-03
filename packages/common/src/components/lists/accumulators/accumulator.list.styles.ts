// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IAccumulatorListStyles {
  accumulatorCardViewStyle: ViewStyle;
}

export const accumulatorListStyles: IAccumulatorListStyles = {
  accumulatorCardViewStyle: {
    marginTop: Spacing.base,
  },
};
