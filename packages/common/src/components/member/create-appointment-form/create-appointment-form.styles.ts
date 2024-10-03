// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { FontSize, RedScale } from '../../../theming/theme';

export interface ICreateAppointmentFormStyles {
  aboutYouContainerViewStyle: ViewStyle;
  aboutYouHeaderTextStyle: TextStyle;
  requestingForCheckboxContainerViewStyle: ViewStyle;
  dependentDetailsContainerViewStyle: ViewStyle;
  dependentNameContainerViewStyle: ViewStyle;
  dependentDOBContainerViewStyle: ViewStyle;
  dependentDetailsTextStyle: ViewStyle;
  dependentInputViewStyle: ViewStyle;
  checkboxTextStyle: TextStyle;
  errorTextStyle: TextStyle;
  dependentContainerViewStyle: ViewStyle;
  dependentHeaderTextStyle: TextStyle;
  dependentHeaderSubTextStyle: TextStyle;
  dependentAddressContainerViewStyle: ViewStyle;
  checkBoxImageStyle: ImageStyle;
  dependentPickerViewStyle: ViewStyle;
  datePickerTextStyle: TextStyle;
  mandatoryIconTextStyle: TextStyle;
  radioButtonViewStyle: ViewStyle;
}

const aboutYouContainerViewStyle: ViewStyle = {
  marginTop: Spacing.base,
};

const mandatoryIconTextStyle: TextStyle = {
  color: RedScale.regular,
  marginLeft: Spacing.quarter,
};

const dependentPickerViewStyle: ViewStyle = {
  marginTop: Spacing.base,
  width: '100%',
};

const aboutYouHeaderTextStyle: TextStyle = {
  color: GrayScaleColor.primaryText,
  fontSize: FontSize.larger,
  ...getFontFace({ weight: FontWeight.bold }),
  marginBottom: 0,
  textAlign: 'left',
};

const requestingForCheckboxContainerViewStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  marginTop: Spacing.base,
  width: '100%',
};

const dependentDetailsContainerViewStyle: ViewStyle = {
  marginTop: Spacing.base,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const dependentNameContainerViewStyle: ViewStyle = {
  maxWidth: '48%',
};

const dependentDOBContainerViewStyle: ViewStyle = {
  width: '100%',
};

const dependentDetailsTextStyle: TextStyle = {
  marginBottom: Spacing.threeQuarters,
};

const dependentInputViewStyle: ViewStyle = {
  marginBottom: Spacing.base,
};

const checkboxTextStyle: TextStyle = {
  lineHeight: 24,
  alignContent: 'center',
  ...getFontFace({ weight: FontWeight.semiBold }),
};

const checkBoxImageStyle: ImageStyle = {
  alignSelf: 'center',
};

const errorTextStyle: TextStyle = {
  color: RedScale.regular,
  fontSize: FontSize.regular,
  ...getFontFace(),
  marginLeft: 10,
  textAlign: 'left',
  paddingBottom: 0,
  marginTop: 10,
  marginBottom: 10,
};

const datePickerTextStyle: TextStyle = {
  fontSize: FontSize.small,
  height: 40,
};

const dependentContainerViewStyle: ViewStyle = {
  ...aboutYouContainerViewStyle,
};

const dependentHeaderTextStyle: TextStyle = {
  color: GrayScaleColor.primaryText,
  fontSize: FontSize.larger,
  ...getFontFace({ weight: FontWeight.bold }),
  marginBottom: 12,
  marginTop: 12,
  textAlign: 'left',
};

const dependentHeaderSubTextStyle: TextStyle = {
  color: GrayScaleColor.primaryText,
  fontSize: FontSize.small,
  ...getFontFace(),
  marginBottom: 12,
  textAlign: 'left',
};
const dependentAddressContainerViewStyle: ViewStyle = {
  marginTop: 20,
  width: '100%',
};

const radioButtonViewStyle: ViewStyle = {
  marginRight: Spacing.times3,
};

export const createAppointmentFormStyles: ICreateAppointmentFormStyles = {
  aboutYouContainerViewStyle,
  aboutYouHeaderTextStyle,
  requestingForCheckboxContainerViewStyle,
  dependentDetailsContainerViewStyle,
  dependentNameContainerViewStyle,
  dependentDOBContainerViewStyle,
  dependentDetailsTextStyle,
  dependentInputViewStyle,
  checkboxTextStyle,
  errorTextStyle,
  dependentContainerViewStyle,
  dependentHeaderTextStyle,
  dependentHeaderSubTextStyle,
  dependentAddressContainerViewStyle,
  checkBoxImageStyle,
  dependentPickerViewStyle,
  datePickerTextStyle,
  mandatoryIconTextStyle,
  radioButtonViewStyle,
};
