// Copyright 2021 Prescryptive Health, Inc.

import { BorderRadius } from '../../../../../../theming/borders';
import { NotificationColor } from '../../../../../../theming/colors';
import {
  getFontDimensions,
  FontWeight,
  getFontFace,
} from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';
import {
  getStartedModalStyles,
  IGetStartedModalStyleProps,
} from './get-started.modal.styles';

describe('getStartedModalStyles', () => {
  it('has expected styles', () => {
    const paragraphBottomMargin = Spacing.times1pt5;

    const expectedStyle: IGetStartedModalStyleProps = {
      headingTextStyle: {
        ...getFontFace({ family: 'Poppins', weight: FontWeight.medium }),
        ...getFontDimensions(32), // TODO: Figma typography doesn't have a definition for this (this isn't an H3).
      },
      strongTextStyle: {
        ...getFontFace({ weight: FontWeight.bold }),
      },
      errorStyle: {
        color: NotificationColor.red,
        marginTop: Spacing.times1pt5,
      },
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

    expect(getStartedModalStyles).toEqual(expectedStyle);
  });
});
