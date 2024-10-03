// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';

export interface ITimeSlotPickerStyles {
  pickerViewStyle: ViewStyle;
  pickerItemStyle: ViewStyle;
}

export const timeSlotPickerStyles: ITimeSlotPickerStyles = {
  pickerViewStyle: {
    width: '100%',
  },
  pickerItemStyle: {
    flexDirection: 'row',
    flex: 1,
  },
};
