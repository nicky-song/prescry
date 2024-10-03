// Copyright 2021 Prescryptive Health, Inc.

import { CSSProperties } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import {
  IMarkdownTextStyles,
  markdownTextStyles,
} from '../../../../components/text/markdown-text/markdown-text.styles';
import { BorderRadius } from '../../../../theming/borders';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import {
  FontSize,
  GreyScale,
  PurpleScale,
  RedScale,
} from '../../../../theming/theme';

export interface IVerifyIdentityScreenStyles {
  basicPageBodyViewStyle: ViewStyle;
  bodyViewStyle: ViewStyle;
  basicPageHeaderViewStyle: ViewStyle;
  dateWrapperViewStyle: ViewStyle;
  errorTextStyle: TextStyle;
  basicPageFooterViewStyle: ViewStyle;
  headerTextStyle: TextStyle;
  inputLabelTextStyle: TextStyle;
  mandatoryIconMarkdownTextStyle: IMarkdownTextStyles;
  phoneNumberCssStyle: CSSProperties;
  textFieldsViewStyle: ViewStyle;
  bodyContainerViewStyle: ViewStyle;
}

const errorTextStyle: TextStyle = {
  marginTop: Spacing.base,
  fontSize: FontSize.small,
  ...getFontFace(),
  color: RedScale.regular,
  maxWidth: 'fit-content',
};

const bodyContainerViewStyle: ViewStyle = {
  flexDirection: 'column',
};

const inputLabelTextStyle: TextStyle = {
  alignSelf: 'flex-start',
  ...getFontFace({ weight: FontWeight.semiBold }),
};

const textFieldsViewStyle: ViewStyle = {
  flexGrow: 1,
  marginTop: Spacing.base,
};

const dateWrapperViewStyle: ViewStyle = {
  marginTop: Spacing.base,
  marginBottom: Spacing.base,
};

const mandatoryIconMarkdownTextStyle: IMarkdownTextStyles = {
  ...markdownTextStyles,
  s: { color: RedScale.regular, textDecorationLine: 'none' },
};

const phoneNumberCssStyle: CSSProperties = {
  borderColor: GreyScale.light,
  borderWidth: 1,
  borderRadius: BorderRadius.normal,
  fontSize: FontSize.regular,
  paddingTop: Spacing.threeQuarters,
  paddingRight: Spacing.base,
  paddingBottom: Spacing.threeQuarters,
  paddingLeft: Spacing.base,
  marginTop: 12,
};

const headerTextStyle: TextStyle = {
  marginBottom: Spacing.times2,
};

const basicPageHeaderViewStyle: ViewStyle = {
  alignItems: 'stretch',
  alignSelf: 'stretch',
  backgroundColor: PurpleScale.lighter,
  flexGrow: 1,
};

const bodyViewStyle: ViewStyle = {
  flexGrow: 1,
  marginTop: Spacing.times1pt5,
  marginRight: Spacing.times1pt5,
  marginBottom: Spacing.times1pt5,
  marginLeft: Spacing.times1pt5,
};

const basicPageFooterViewStyle: ViewStyle = {
  width: '100%',
  paddingTop: Spacing.times1pt5,
  paddingRight: Spacing.times1pt5,
  paddingBottom: Spacing.times1pt5,
  paddingLeft: Spacing.times1pt5,
};

const basicPageBodyViewStyle: ViewStyle = {
  paddingBottom: 0,
};

export const verifyIdentityScreenStyles: IVerifyIdentityScreenStyles = {
  basicPageBodyViewStyle,
  bodyViewStyle,
  basicPageHeaderViewStyle,
  dateWrapperViewStyle,
  errorTextStyle,
  basicPageFooterViewStyle,
  headerTextStyle,
  inputLabelTextStyle,
  mandatoryIconMarkdownTextStyle,
  phoneNumberCssStyle,
  textFieldsViewStyle,
  bodyContainerViewStyle,
};
