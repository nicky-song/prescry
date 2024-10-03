// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';

export interface IDependentPickerStyle {
  dependentPickerContainerStyle: ViewStyle;
  basePickerStyle: ViewStyle;
}

export const dependentPickerStyle: IDependentPickerStyle = {
  dependentPickerContainerStyle: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
  },
  basePickerStyle: {
    width: '100%',
  },
};
