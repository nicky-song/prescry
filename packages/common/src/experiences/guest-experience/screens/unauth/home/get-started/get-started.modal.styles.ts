// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { BorderRadius } from '../../../../../../theming/borders';
import { NotificationColor } from '../../../../../../theming/colors';
import {
  getFontDimensions,
  FontWeight,
  getFontFace,
} from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';

export interface IGetStartedModalStyleProps {
  headingTextStyle: TextStyle;
  strongTextStyle: TextStyle;
  errorStyle: TextStyle;
  footerViewStyle: ViewStyle;
  lineSeparatorViewStyle: ViewStyle;
  footerImageStyle: ImageStyle;
  pageModalViewStyle: ViewStyle;
  paragraphTextStyle: TextStyle;
  formViewStyle: ViewStyle;
  haveQuestionsParagraphTextStyle: TextStyle;
}

const paragraphBottomMargin = Spacing.times1pt5;

export const getStartedModalStyles: IGetStartedModalStyleProps = {
  headingTextStyle: {
    ...getFontFace({ family: 'Poppins', weight: FontWeight.medium }),
    ...getFontDimensions(32), // TODO: Figma typography doesn't have a definition for this (this isn't an H3).
  },
  strongTextStyle: {
    ...getFontFace({ weight: FontWeight.bold }),
  },
  errorStyle: { color: NotificationColor.red, marginTop: Spacing.times1pt5 },
  footerViewStyle: {
    height: 88,
    width: '100%',
    alignItems: 'center',
  },
  lineSeparatorViewStyle: { width: '100%' },
  footerImageStyle: {
    width: 120,
  },
  pageModalViewStyle: {
    borderRadius: BorderRadius.times3,
    width: '70%',
    maxWidth: 900,
  },
  paragraphTextStyle: {
    marginBottom: paragraphBottomMargin,
  },
  formViewStyle: {
    marginTop: Spacing.times2pt5 - paragraphBottomMargin,
  },
  haveQuestionsParagraphTextStyle: {
    marginTop: Spacing.times4,
  },
};
