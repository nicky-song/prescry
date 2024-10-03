// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { GrayScaleColor } from '../../../../theming/colors';
import { getFontFace } from '../../../../theming/fonts';
import { GreyScale, FontSize, RedScale } from '../../../../theming/theme';

export interface ISurveyTextInputStyles {
  inputTextStyle: TextStyle;
  errorTextStyle: TextStyle;
}

const inputTextStyle: TextStyle = {
  borderColor: GreyScale.light,
  borderWidth: 1,
  color: GrayScaleColor.primaryText,
  ...getFontFace(),
  fontSize: FontSize.small,
  padding: 10,
};
const errorTextStyle: TextStyle = {
  padding: 10,
  color: RedScale.regular,
  fontSize: FontSize.small,
  ...getFontFace(),
  paddingLeft: 0,
};
export const surveyTextInputStyles: ISurveyTextInputStyles = {
  inputTextStyle,
  errorTextStyle,
};
