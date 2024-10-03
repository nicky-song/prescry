// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { FontSize } from '../../../../theming/theme';
import {
  ISurveyDatePickerStyles,
  surveyDatePickerStyles,
} from './survey-date-picker.styles';

const inputTextStyle: TextStyle = {
  fontSize: FontSize.small,
};

describe('surveyDatePickerStyles', () => {
  it('has expected default styles', () => {
    const expectedStyles: ISurveyDatePickerStyles = {
      inputTextStyle,
    };

    expect(surveyDatePickerStyles).toEqual(expectedStyles);
  });
});
