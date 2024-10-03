// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontSize } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IFilterButtonStyles {
  iconTextStyle: TextStyle;
  toolButtonViewStyle: ViewStyle;
}

export const filterButtonStyles: IFilterButtonStyles = {
  iconTextStyle: {
    fontSize: FontSize.body,
    marginRight: Spacing.half,
  },
  toolButtonViewStyle: {
    padding: 0,
    width: 74,
  },
};
