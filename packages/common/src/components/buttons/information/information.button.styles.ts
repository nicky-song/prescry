// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IInformationButtonStyles {
  iconTextStyle: TextStyle;
  iconButtonViewStyle: ViewStyle;
}

export const informationButtonStyles: IInformationButtonStyles = {
  iconTextStyle: {
    color: PrimaryColor.darkBlue,
    fontSize: 18,
  },
  iconButtonViewStyle: {
    padding: Spacing.half,
  },
};
