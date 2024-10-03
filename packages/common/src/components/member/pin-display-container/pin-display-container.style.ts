// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';

export interface IPinDisplayContainerStyle {
  containerViewStyle: ViewStyle;
  pinContainerViewStyle: ViewStyle;
}

const containerViewStyle: ViewStyle = { maxHeight: 36, flexDirection: 'row' };

const pinContainerViewStyle: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'space-around',
  height: 36,
  width: 36,
};

export const pinDisplayContainerStyle: IPinDisplayContainerStyle = {
  containerViewStyle,
  pinContainerViewStyle,
};
