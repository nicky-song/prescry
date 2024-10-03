// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';

export interface IDatePickerStyle {
  containerViewStyle: ViewStyle;
  monthPickerTextStyle: TextStyle;
  dayPickerTextStyle: TextStyle;
  yearPickerTextStyle: TextStyle;
}

export const datePickerStyles: IDatePickerStyle = {
  containerViewStyle: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  monthPickerTextStyle: {
    flex: 4,
  },
  dayPickerTextStyle: {
    flex: 1,
    marginHorizontal: Spacing.half,
  },
  yearPickerTextStyle: {
    flex: 2,
  },
};
