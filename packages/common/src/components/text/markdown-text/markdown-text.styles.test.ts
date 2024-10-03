// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IMarkdownTextStyles,
  markdownTextStyles,
} from './markdown-text.styles';

const bulletListIconViewStyle: ViewStyle = {
  alignSelf: 'baseline',
};

const bulletListContentViewStyle: ViewStyle = {
  alignSelf: 'baseline',
};

const softbreakTextStyle: TextStyle = {
  display: 'flex',
  height: '0.5em',
};

const heading1TextStyle: TextStyle = {
  fontSize: FontSize.large,
  ...getFontFace({ weight: FontWeight.bold }),
  marginBottom: 10,
};

const heading2TextStyle: TextStyle = {
  ...getFontDimensions(20),
  ...getFontFace({ weight: FontWeight.bold }),
  marginBottom: Spacing.threeQuarters,
};

const linkTextStyle: TextStyle = {
  color: PrimaryColor.prescryptivePurple,
  ...getFontFace({ weight: FontWeight.semiBold }),
  textDecorationLine: 'none',
  borderBottomWidth: 1,
  borderBottomColor: PrimaryColor.prescryptivePurple,
};

const orderedListIconViewStyle: ViewStyle = {
  alignSelf: 'baseline',
};

const orderedListContentViewStyle: ViewStyle = {
  alignSelf: 'baseline',
};

const paragraphTextStyle: TextStyle = {
  marginBottom: 0,
  marginTop: 0,
};

const boldTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.bold }),
};

describe('markdownTextStyles', () => {
  it('has expected styles (default)', () => {
    const expectedStyles: IMarkdownTextStyles = {
      bullet_list_content: bulletListContentViewStyle,
      bullet_list_icon: bulletListIconViewStyle,
      heading1: heading1TextStyle,
      heading2: heading2TextStyle,
      link: linkTextStyle,
      ordered_list_content: orderedListContentViewStyle,
      ordered_list_icon: orderedListIconViewStyle,
      paragraph: paragraphTextStyle,
      softbreak: softbreakTextStyle,
      strong: boldTextStyle,
    };
    expect(markdownTextStyles).toEqual(expectedStyles);
  });
});
