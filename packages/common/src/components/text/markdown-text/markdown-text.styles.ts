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

export interface IMarkdownTextStyles {
  bullet_list_icon?: ViewStyle;
  bullet_list_content?: ViewStyle;
  heading1?: TextStyle;
  heading2?: TextStyle;
  link?: TextStyle;
  ordered_list_icon?: ViewStyle;
  ordered_list_content?: ViewStyle;
  paragraph?: TextStyle;
  softbreak?: TextStyle;
  s?: TextStyle;
  strong?: TextStyle;
}

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

// See https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/styles.js
// for the set of style properties accepted by the Markdown renderer.
const defaultStyleSheet: IMarkdownTextStyles = {
  bullet_list_content: bulletListContentViewStyle,
  bullet_list_icon: bulletListIconViewStyle,
  softbreak: softbreakTextStyle,
  heading1: heading1TextStyle,
  heading2: heading2TextStyle,
  link: linkTextStyle,
  ordered_list_content: orderedListContentViewStyle,
  ordered_list_icon: orderedListIconViewStyle,
  paragraph: paragraphTextStyle,
  strong: boldTextStyle,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const markdownTextStyles = defaultStyleSheet as any;
