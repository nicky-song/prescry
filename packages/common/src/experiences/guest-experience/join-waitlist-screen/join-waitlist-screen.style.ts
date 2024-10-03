// Copyright 2021 Prescryptive Health, Inc.

import { CSSProperties } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import {
  IMarkdownTextStyles,
  markdownTextStyles,
} from '../../../components/text/markdown-text/markdown-text.styles';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { GreyScale, FontSize, RedScale } from '../../../theming/theme';

const headerTextStyle: TextStyle = {
  color: GreyScale.darkest,
  fontSize: FontSize.ultra,
  ...getFontFace({ weight: FontWeight.bold }),
  textAlign: 'left',
};

const headerViewStyle: ViewStyle = {
  marginHorizontal: Spacing.times1pt5,
  marginTop: Spacing.times1pt5,
  marginBottom: 0,
};

const bodyViewStyle: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  margin: Spacing.times1pt5,
};

const selectedServiceTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.bold }),
  marginTop: Spacing.base,
  marginBottom: Spacing.half,
};

const selectedServiceViewStyle: ViewStyle = {
  marginTop: Spacing.base,
};

const leftItemViewStyle: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-start',
  marginTop: Spacing.base,
};

const rightItemViewStyle: ViewStyle = {
  ...leftItemViewStyle,
  justifyContent: 'flex-end',
  marginLeft: '4%',
};

const fullItemViewStyle: ViewStyle = {
  ...leftItemViewStyle,
  maxWidth: '100%',
  width: '100%',
};

const personDropDownContainerStyle: ViewStyle = {
  ...leftItemViewStyle,
  maxWidth: '100%',
  width: '100%',
};

const formItemTextStyle: TextStyle = {
  flex: 1,
  flexDirection: 'row',
  borderWidth: 1,
  borderRadius: BorderRadius.normal,
  borderColor: GrayScaleColor.borderLines,
  fontSize: FontSize.large,
  ...getFontFace(),
  height: 48,
  padding: Spacing.threeQuarters,
};

const leftFormItemTextStyle: TextStyle = {
  ...formItemTextStyle,
  justifyContent: 'flex-start',
};

const phoneNumberTextStyle: CSSProperties = {
  justifyContent: 'flex-start',
  borderWidth: 1,
  borderRadius: BorderRadius.normal,
  borderColor: GreyScale.light,
  fontSize: FontSize.large,
  height: 48,
  padding: Spacing.threeQuarters,
  boxSizing: 'border-box',
};

const pickerContainerTextStyle: TextStyle = {
  flex: 1,
  fontSize: FontSize.large,
  paddingRight: Spacing.times2,
};

const formItemLabelTextStyle: TextStyle = {
  flexGrow: 0,
  ...getFontFace({ weight: FontWeight.semiBold }),
  marginBottom: Spacing.half,
};

const otherPersonConsentTextStyle: TextStyle = {
  flexGrow: 0,
  color: GrayScaleColor.primaryText,
  fontSize: FontSize.small,
  ...getFontFace(),
  marginBottom: Spacing.eighth,
  marginTop: Spacing.threeQuarters,
};

const mandatoryIconTextStyle: IMarkdownTextStyles = {
  ...markdownTextStyles,
  s: { color: RedScale.regular, textDecorationLine: 'none' },
};

const locationFormViewStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-between',
};

const errorTextStyle: TextStyle = {
  color: RedScale.regular,
  fontSize: FontSize.small,
  ...getFontFace(),
  textAlign: 'left',
  marginTop: Spacing.base,
};

const buttonContainerViewStyle: ViewStyle = {
  marginTop: Spacing.times4,
};

const buttonContainerWithErrorViewStyle: ViewStyle = {
  marginTop: Spacing.times2,
};

const otherPersonInfoContainerViewStyle: ViewStyle = {
  paddingRight: Spacing.threeQuarters,
  width: '90%',
};

const dependentPickerContainerStyle: TextStyle = {
  flex: 1,
  fontSize: FontSize.large,
  width: '100%',
  ...getFontFace(),
};

const otherPersonDetailsContainerStyle: ViewStyle = {
  width: '100%',
};

const otherPersonFormContainerStyle: ViewStyle = {
  marginTop: Spacing.times1pt5,
};

export const joinWaitlistScreenStyle = {
  headerViewStyle,
  headerTextStyle,
  bodyViewStyle,
  selectedServiceTextStyle,
  selectedServiceViewStyle,
  leftFormItemTextStyle,
  phoneNumberTextStyle,
  leftItemViewStyle,
  rightItemViewStyle,
  fullItemViewStyle,
  formItemLabelTextStyle,
  mandatoryIconTextStyle,
  pickerContainerTextStyle,
  locationFormViewStyle,
  errorTextStyle,
  buttonContainerViewStyle,
  otherPersonInfoContainerViewStyle,
  dependentPickerContainerStyle,
  otherPersonConsentTextStyle,
  otherPersonDetailsContainerStyle,
  otherPersonFormContainerStyle,
  buttonContainerWithErrorViewStyle,
  personDropDownContainerStyle,
};
