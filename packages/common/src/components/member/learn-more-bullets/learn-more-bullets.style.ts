// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { IMarkdownTextStyles } from '../../text/markdown-text/markdown-text.styles';

export interface ILearnMoreStyles {
  pointViewStyle: ViewStyle;
  bulletViewStyle: ViewStyle;
  renderContainer: ViewStyle;
  noRenderViewStyle: ViewStyle;
  titleTextStyle: TextStyle;
  markDownLinkTextStyle: IMarkdownTextStyles;
  lastPointViewStyle: ViewStyle;
  bulletTextStyle: TextStyle;
}

const pointViewStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'baseline',
  marginBottom: Spacing.base,
};

const lastPointViewStyle: ViewStyle = {
  ...pointViewStyle,
  marginBottom: Spacing.base,
};

const bulletViewStyle: ViewStyle = {
  borderRadius: BorderRadius.half,
  height: 8,
  width: 8,
  maxWidth: 8,
  backgroundColor: GrayScaleColor.primaryText,
  marginRight: Spacing.half,
};

const renderContainer: ViewStyle = {
  display: 'flex',
  paddingTop: Spacing.threeQuarters,
  paddingBottom: 0,
};

const noRenderViewStyle: ViewStyle = { display: 'none' };

const titleTextStyle: TextStyle = {
  fontSize: FontSize.body,
  ...getFontFace({ weight: FontWeight.semiBold }),
  marginBottom: Spacing.times1pt5,
  color: GrayScaleColor.primaryText,
};

const bulletTextStyle: TextStyle = {
  color: GrayScaleColor.primaryText,
};

const markDownLinkTextStyle: IMarkdownTextStyles = {
  link: {
    textDecorationLine: 'none',
    color: PrimaryColor.darkPurple,
    ...getFontFace({ weight: FontWeight.bold }),
  },
  s: bulletTextStyle,
};

export const learnMoreBulletStyle: ILearnMoreStyles = {
  pointViewStyle,
  bulletViewStyle,
  renderContainer,
  noRenderViewStyle,
  titleTextStyle,
  markDownLinkTextStyle,
  lastPointViewStyle,
  bulletTextStyle,
};
