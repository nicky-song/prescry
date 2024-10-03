// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import {
  ISurveyTextInputStyles,
  surveyTextInputStyles,
} from './survey-text-input.styles';
import { GreyScale, FontSize, RedScale } from '../../../../theming/theme';
import { getFontFace } from '../../../../theming/fonts';
import { GrayScaleColor } from '../../../../theming/colors';

describe('surveyTextInputStyles', () => {
  it('has expected default styles', () => {
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

    const expectedStyles: ISurveyTextInputStyles = {
      inputTextStyle,
      errorTextStyle,
    };

    expect(surveyTextInputStyles).toEqual(expectedStyles);
  });
});
