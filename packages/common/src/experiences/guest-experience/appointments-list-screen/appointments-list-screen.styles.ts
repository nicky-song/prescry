// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IAppointmentsListScreenStyles {
  headerViewStyle: ViewStyle;
  headerTextStyle: TextStyle;
  bodyViewStyle: ViewStyle;
  tabViewStyle: ViewStyle;
  tabViewStyleHighlighted: ViewStyle;
}

const headerViewStyle: ViewStyle = {
  paddingBottom: 0,
};
const bodyViewStyle: ViewStyle = {
  flex: 1,
  margin: Spacing.times1pt5,
};
const headerTextStyle: TextStyle = {
  marginTop: Spacing.times1pt5,
  marginLeft: Spacing.times1pt5,
  marginRight: Spacing.times1pt5,
};
const tabViewStyle: ViewStyle = {
  borderBottomWidth: 4,
  borderColor: GrayScaleColor.white,
  alignItems: 'center',
};
const tabViewStyleHighlighted: ViewStyle = {
  ...tabViewStyle,
  borderColor: PrimaryColor.prescryptivePurple,
};
export const appointmentsListScreenStyles: IAppointmentsListScreenStyles = {
  headerViewStyle,
  headerTextStyle,
  bodyViewStyle,
  tabViewStyle,
  tabViewStyleHighlighted,
};
