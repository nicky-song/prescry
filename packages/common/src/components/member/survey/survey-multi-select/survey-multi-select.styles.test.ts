// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GreyScale, FontSize } from '../../../../theming/theme';
import {
  ISurveyMultiSelectStyles,
  surveyMultiSelectStyles,
} from './survey-multi-select.styles';

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

describe('surveyMultiSelectStyles', () => {
  it('has expected default styles', () => {
    const expectedStyles: ISurveyMultiSelectStyles = {
      checkboxTextStyle,
      checkboxViewStyle,
    };

    expect(surveyMultiSelectStyles).toEqual(expectedStyles);
  });
});
