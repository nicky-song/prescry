// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IBodyContentContainerStyles {
  titleViewStyle: ViewStyle;
  viewStyle: ViewStyle;
}

export const bodyContentContainerStyles: IBodyContentContainerStyles = {
  titleViewStyle: {
    marginBottom: Spacing.base,
  },
  viewStyle: {
    paddingTop: Spacing.times1pt5,
    paddingRight: Spacing.times1pt5,
    paddingBottom: Spacing.times2,
    paddingLeft: Spacing.times1pt5,
  },
};
