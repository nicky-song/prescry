// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { ISurveyItemStyles, surveyItemStyles } from './survey-item.styles';
import { FontSize, GreyScale, RedScale } from '../../../../theming/theme';
import {
  IMarkdownTextStyles,
  markdownTextStyles,
} from '../../../text/markdown-text/markdown-text.styles';
import { getFontFace } from '../../../../theming/fonts';

describe('surveyItemStyles', () => {
  it('has expected default styles', () => {
    const questionTextStyle: TextStyle = {
      color: GreyScale.darker,
      ...getFontFace(),
      fontSize: FontSize.small,
      marginBottom: 3,
      marginTop: 8,
    };

    const mandatoryIconTextStyle: IMarkdownTextStyles = {
      ...markdownTextStyles,
      s: { color: RedScale.regular, textDecorationLine: 'none' },
    };
    const descriptionTextStyle: TextStyle = {
      color: GreyScale.lighterDark,
      ...getFontFace(),
      fontSize: FontSize.small,
    };

    const expectedStyles: ISurveyItemStyles = {
      questionTextStyle,
      descriptionTextStyle,
      mandatoryIconTextStyle,
    };

    expect(surveyItemStyles).toEqual(expectedStyles);
  });
});
