// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IWaitlistConfirmationScreenStyle {
  secondaryButtonViewStyle: ViewStyle;
  primaryButtonViewStyle: ViewStyle;
  formattedConfirmationParagraphSpacerViewStyle: ViewStyle;
  formattedConfirmationTextViewStyle: ViewStyle;
  confirmationSegmentTextBoldWeight: TextStyle;
}

const primaryButtonViewStyle: ViewStyle = {
  marginTop: Spacing.times1pt25,
};

const secondaryButtonViewStyle: ViewStyle = {
  marginTop: Spacing.times1pt25,
};

const formattedConfirmationParagraphSpacerViewStyle: ViewStyle = {
  marginBottom: Spacing.half,
};

const formattedConfirmationTextViewStyle: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
};

const confirmationSegmentTextBoldWeight: TextStyle = {
  ...getFontFace({ weight: FontWeight.bold }),
};

export const WaitlistConfirmationScreenStyle: IWaitlistConfirmationScreenStyle =
  {
    secondaryButtonViewStyle,
    primaryButtonViewStyle,
    formattedConfirmationParagraphSpacerViewStyle,
    formattedConfirmationTextViewStyle,
    confirmationSegmentTextBoldWeight,
  };
