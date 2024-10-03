// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IFooterContentContainerStyles {
  viewStyle: ViewStyle;
}

export const footerContentContainerStyles: IFooterContentContainerStyles = {
  viewStyle: {
    paddingTop: Spacing.times2,
    paddingRight: Spacing.times1pt5,
    paddingBottom: Spacing.times2,
    paddingLeft: Spacing.times1pt5,
    width: '100%',
  },
};
