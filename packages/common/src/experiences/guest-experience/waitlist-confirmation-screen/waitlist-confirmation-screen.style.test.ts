// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

import { WaitlistConfirmationScreenStyle } from './waitlist-confirmation-screen.style';

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

describe('waitlistConfirmationScreenStyle', () => {
  it('has expected styles', () => {
    expect(WaitlistConfirmationScreenStyle.primaryButtonViewStyle).toEqual(
      primaryButtonViewStyle
    );
    expect(WaitlistConfirmationScreenStyle.secondaryButtonViewStyle).toEqual(
      secondaryButtonViewStyle
    );
    expect(
      WaitlistConfirmationScreenStyle.formattedConfirmationParagraphSpacerViewStyle
    ).toEqual(formattedConfirmationParagraphSpacerViewStyle);
    expect(
      WaitlistConfirmationScreenStyle.formattedConfirmationTextViewStyle
    ).toEqual(formattedConfirmationTextViewStyle);
    expect(
      WaitlistConfirmationScreenStyle.confirmationSegmentTextBoldWeight
    ).toEqual(confirmationSegmentTextBoldWeight);
  });
});
