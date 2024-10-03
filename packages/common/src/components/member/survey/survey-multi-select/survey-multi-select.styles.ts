// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GreyScale, FontSize } from '../../../../theming/theme';

export interface ISurveyMultiSelectStyles {
  checkboxTextStyle: TextStyle;
  checkboxViewStyle: ViewStyle;
}

const checkboxTextStyle: TextStyle = {
  color: GreyScale.darker,
  fontSize: FontSize.small,
  alignSelf: 'center',
  lineHeight: 22,
};

const checkboxViewStyle: ViewStyle = {
  marginBottom: 8,
  marginLeft: 12,
  marginTop: 8,
};

export const surveyMultiSelectStyles: ISurveyMultiSelectStyles = {
  checkboxTextStyle,
  checkboxViewStyle,
};
