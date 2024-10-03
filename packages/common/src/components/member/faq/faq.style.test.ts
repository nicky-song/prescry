// Copyright 2021 Prescryptive Health, Inc.

import { GreyScale, FontSize } from '../../../theming/theme';
import { Spacing } from '../../../theming/spacing';
import { faqStyles, IFAQStyles } from './faq.style';
import { FontWeight, getFontFace } from '../../../theming/fonts';

describe('faqStyles', () => {
  it('should have expected styles', () => {
    const expectedStyles: IFAQStyles = {
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
    expect(faqStyles).toEqual(expectedStyles);
  });
});
