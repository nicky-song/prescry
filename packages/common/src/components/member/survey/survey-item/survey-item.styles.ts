// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { getFontFace } from '../../../../theming/fonts';
import { FontSize, GreyScale, RedScale } from '../../../../theming/theme';
import {
  IMarkdownTextStyles,
  markdownTextStyles,
} from '../../../text/markdown-text/markdown-text.styles';

export interface ISurveyItemStyles {
  questionTextStyle: TextStyle;
  descriptionTextStyle: TextStyle;
  mandatoryIconTextStyle: IMarkdownTextStyles;
}

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
export const surveyItemStyles: ISurveyItemStyles = {
  questionTextStyle,
  descriptionTextStyle,
  mandatoryIconTextStyle,
};
