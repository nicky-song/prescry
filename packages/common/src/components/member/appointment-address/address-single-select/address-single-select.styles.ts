// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import { GreyScale, FontSize, RedScale } from '../../../../theming/theme';
import {
  IMarkdownTextStyles,
  markdownTextStyles,
} from '../../../text/markdown-text/markdown-text.styles';

export interface IAddressSingleSelectStyles {
  errorTextStyle: TextStyle;
  markdownlabelTextStyle: TextStyle;
  statePickerContainerViewStyle: ViewStyle;
  addressSingleSelectViewStyle: ViewStyle;
  mandatoryIconTextStyle: IMarkdownTextStyles;
}

const mandatoryIconTextStyle: IMarkdownTextStyles = {
  ...markdownTextStyles,
  s: { color: RedScale.regular, textDecorationLine: 'none' },
};

const errorTextStyle: TextStyle = {
  padding: 0,
  color: RedScale.regular,
  fontSize: FontSize.small,
  ...getFontFace(),
  marginTop: Spacing.threeQuarters,
};
const markdownlabelTextStyle: TextStyle = {
  color: GreyScale.darker,
  ...getFontFace({ weight: FontWeight.semiBold }),
  flexGrow: 0,
  marginBottom: Spacing.threeQuarters,
};

const statePickerContainerViewStyle: ViewStyle = {
  width: '100%',
};

const addressSingleSelectViewStyle: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-start',
};

export const addressSingleSelectStyles: IAddressSingleSelectStyles = {
  errorTextStyle,
  markdownlabelTextStyle,
  statePickerContainerViewStyle,
  addressSingleSelectViewStyle,
  mandatoryIconTextStyle,
};
