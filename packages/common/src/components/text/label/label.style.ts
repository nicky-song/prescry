// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import { RedScale } from '../../../theming/theme';

export interface ILabelStyle {
  aboveTextStyle: TextStyle;
  aboveViewStyle: ViewStyle;
  leftTextStyle: TextStyle;
  leftViewStyle: ViewStyle;
  requiredTextStyle: TextStyle;
  rightTextStyle: TextStyle;
  rightViewStyle: ViewStyle;
}

export const labelStyle: ILabelStyle = {
  aboveTextStyle: {
    marginBottom: Spacing.threeQuarters,
  },
  aboveViewStyle: {
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  leftTextStyle: {
    marginRight: Spacing.threeQuarters,
  },
  leftViewStyle: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  requiredTextStyle: {
    marginLeft: Spacing.quarter,
    color: RedScale.regular,
  },
  rightTextStyle: {
    marginLeft: Spacing.threeQuarters,
  },
  rightViewStyle: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
};
