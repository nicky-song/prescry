// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import { FontSize, FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface IAppointmentsListStyles {
  appointmentListItemTextStyle: TextStyle;
  appointmentListViewStyle: ViewStyle;
  appointmentListHeaderTextStyle: TextStyle;
  listEndButtonViewStyle: ViewStyle;
  listEndButtonTextStyle: TextStyle;
  noAppointmentsInnerContainerViewStyle: ViewStyle;
  noAppointmentsTitleTextStyle: TextStyle;
  noAppointmentsTextStyle: TextStyle;
  iconTextStyle: TextStyle;
  noAppointmentsContainerViewStyle: ViewStyle;
  tabContainerViewStyle: ViewStyle;
}

const appointmentListViewStyle: ViewStyle = {
  paddingTop: Spacing.base,
  paddingLeft: Spacing.times1pt5,
  paddingRight: Spacing.times1pt5,
  paddingBottom: Spacing.half,
  alignSelf: 'stretch',
  flex: 1,
};
const appointmentListItemTextStyle: TextStyle = {
  alignItems: 'flex-start',
  marginBottom: Spacing.base,
};

const appointmentListHeaderTextStyle: TextStyle = {
  color: GrayScaleColor.black,
  textAlign: 'left',
  fontSize: FontSize.large,
  ...getFontFace({ weight: FontWeight.bold }),
  paddingBottom: Spacing.times1pt25,
};
const listEndButtonViewStyle: ViewStyle = {
  backgroundColor: GrayScaleColor.white,
  paddingTop: 0,
};
const listEndButtonTextStyle: TextStyle = {
  color: PrimaryColor.prescryptivePurple,
  ...getFontFace({ weight: FontWeight.bold }),
};
const noAppointmentsInnerContainerViewStyle: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: Spacing.times2,
};
const noAppointmentsTextStyle: TextStyle = {
  textAlign: 'center',
  paddingTop: Spacing.base,
  flexGrow: 0,
};
const noAppointmentsTitleTextStyle: TextStyle = {
  ...noAppointmentsTextStyle,
  ...getFontFace({ weight: FontWeight.semiBold }),
  flexGrow: 0,
};
const iconTextStyle: TextStyle = {
  fontSize: FontSize.h1,
  flexGrow: 0,
  alignSelf: 'center',
};
const noAppointmentsContainerViewStyle: ViewStyle = {
  flex: 1,
  marginTop: Spacing.base,
};
const tabContainerViewStyle: ViewStyle = {
  marginBottom: Spacing.base,
};

export const appointmentsListStyles: IAppointmentsListStyles = {
  appointmentListItemTextStyle,
  appointmentListViewStyle,
  appointmentListHeaderTextStyle,
  listEndButtonViewStyle,
  listEndButtonTextStyle,
  noAppointmentsInnerContainerViewStyle,
  noAppointmentsTitleTextStyle,
  noAppointmentsTextStyle,
  iconTextStyle,
  noAppointmentsContainerViewStyle,
  tabContainerViewStyle,
};
