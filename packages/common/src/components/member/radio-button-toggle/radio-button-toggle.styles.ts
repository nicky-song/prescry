// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { FontSize, RedScale } from '../../../theming/theme';
import {
  IMarkdownTextStyles,
  markdownTextStyles,
} from '../../text/markdown-text/markdown-text.styles';

const containerViewStyle: ViewStyle = {
  marginTop: Spacing.times1pt5,
  width: '90%',
};

const checkBoxContainerViewStyle: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: Spacing.times1pt25,
  width: '96%',
};

const headerTextStyle: TextStyle = {
  marginBottom: Spacing.eighth,
  textAlign: 'left',
};

const mandatoryIconTextStyle: IMarkdownTextStyles = {
  ...markdownTextStyles,
  s: { color: RedScale.regular, textDecorationLine: 'none' },
};

const buttonTextStyle: TextStyle = {
  color: GrayScaleColor.primaryText,
  fontSize: FontSize.regular,
  ...getFontFace({ weight: FontWeight.semiBold }),
  marginLeft: Spacing.base,
};

export const radioButtonToggleStyles = {
  containerViewStyle,
  checkBoxContainerViewStyle,
  headerTextStyle,
  mandatoryIconTextStyle,
  buttonTextStyle,
};
