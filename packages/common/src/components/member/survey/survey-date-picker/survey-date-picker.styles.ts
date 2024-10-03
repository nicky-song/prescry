// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { FontSize } from '../../../../theming/theme';

export interface ISurveyDatePickerStyles {
  inputTextStyle: TextStyle;
}

const inputTextStyle: TextStyle = {
  fontSize: FontSize.small,
};

export const surveyDatePickerStyles: ISurveyDatePickerStyles = {
  inputTextStyle,
};
