// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { FontSize, GreyScale } from '../../../theming/theme';
import { Spacing } from '../../../theming/spacing';
import { FontWeight, getFontFace } from '../../../theming/fonts';

export interface IFAQStyles {
  titleViewStyle: ViewStyle;
  titleTextStyle: TextStyle;
  questionAnswerViewStyle: ViewStyle;
  lastQuestionAnswerViewStyle: ViewStyle;
  questionViewStyle: ViewStyle;
  questionTextStyle: TextStyle;
  arrowViewStyle: ViewStyle;
  answerViewStyle: ViewStyle;
}

export const faqStyles: IFAQStyles = {
  titleViewStyle: {
    marginBottom: Spacing.quarter,
  },
  titleTextStyle: {
    ...getFontFace({ weight: FontWeight.bold }),
    fontSize: FontSize.regular,
  },
  questionAnswerViewStyle: {
    borderBottomColor: GreyScale.light,
    borderBottomWidth: 1,
    marginTop: Spacing.half,
    paddingBottom: Spacing.half,
  },
  lastQuestionAnswerViewStyle: {
    marginTop: Spacing.half,
    paddingBottom: Spacing.half,
  },
  questionViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionTextStyle: {
    ...getFontFace({ weight: FontWeight.bold }),
  },
  arrowViewStyle: {
    backgroundColor: GreyScale.lightest,
    width: FontSize.largest,
    height: FontSize.largest,
  },
  answerViewStyle: {
    marginTop: Spacing.quarter,
  },
};
