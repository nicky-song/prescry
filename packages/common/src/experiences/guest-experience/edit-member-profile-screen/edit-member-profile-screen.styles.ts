// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { getFontFace } from '../../../theming/fonts';
import { IconSize } from '../../../theming/icons';
import { Spacing } from '../../../theming/spacing';
import {
  FontSize,
  getDimension,
  GreyScale,
  LocalDimensions,
  PurpleScale,
  RedScale,
} from '../../../theming/theme';
import { getContainerHeightMinusHeader } from '../../../utils/responsive-screen.helper';

export interface IEditMemberProfileScreenStyle {
  bodyInputText: TextStyle;
  bodyMobileInfoText: TextStyle;
  bodyPinText: TextStyle;
  bodyPlaceholderText: TextStyle;
  bodyViewStyle: ViewStyle;
  dialingCode: TextStyle;
  editButtonViewStyle: ViewStyle;
  editButtonIconTextStyle: TextStyle;
  errorMessageText: TextStyle;
  headerNameText: TextStyle;
  headerRxContainerText: TextStyle;
  headerRxIdText: TextStyle;
  headerRxTitleText: TextStyle;
  paddingHeader: TextStyle;
  pinContainer: ViewStyle;
  emailAddressContainer: ViewStyle;
  textContainer: ViewStyle;
  footerContainerViewStyle: ViewStyle;
  basePickerViewStyle: ViewStyle;
}

const headerNameText: TextStyle = {
  color: PurpleScale.darkest,
  ...getFontFace(),
  fontSize: FontSize.larger,
  paddingBottom: Spacing.threeQuarters,
  paddingHorizontal: Spacing.times1pt25,
  paddingTop: Spacing.times1pt25,
};

const headerRxContainerText: TextStyle = {
  paddingBottom: Spacing.times1pt25,
  paddingHorizontal: Spacing.times1pt25,
  paddingTop: Spacing.threeQuarters,
};

const headerRxTitleText: TextStyle = {
  color: GreyScale.lighterDark,
  ...getFontFace(),
  fontSize: FontSize.regular,
};

const headerRxIdText: TextStyle = {
  color: GreyScale.darkest,
  ...getFontFace(),
  fontSize: FontSize.small,
};

const bodyInputText: TextStyle = {
  alignSelf: 'center',
  color: GreyScale.lighterDark,
  ...getFontFace(),
  fontSize: FontSize.small,
  paddingBottom: Spacing.threeQuarters,
  paddingHorizontal: Spacing.threeQuarters,
  paddingTop: Spacing.times1pt25,
  width: getDimension(LocalDimensions.maxWidth, 'width', 0.9),
};

const bodyPlaceholderText: TextStyle = {
  alignSelf: 'center',
  borderBottomWidth: 0.5,
  fontSize: FontSize.regular,
  ...getFontFace(),
  paddingHorizontal: Spacing.threeQuarters,
  paddingVertical: 5,
  width: getDimension(LocalDimensions.maxWidth, 'width', 0.9),
};

const bodyMobileInfoText: TextStyle = {
  alignSelf: 'center',
  color: GreyScale.lighterDark,
  ...getFontFace(),
  fontSize: FontSize.small,
  paddingBottom: Spacing.threeQuarters,
  paddingHorizontal: Spacing.threeQuarters,
  paddingTop: Spacing.threeQuarters,
  width: getDimension(LocalDimensions.maxWidth, 'width', 0.9),
};

const emailAddressContainer: ViewStyle = {
  alignSelf: 'center',
  width: getDimension(LocalDimensions.maxWidth, 'width', 0.9),
};

const textContainer: ViewStyle = {
  alignSelf: 'center',
  borderBottomWidth: 0.5,
  paddingHorizontal: Spacing.threeQuarters,
  width: getDimension(LocalDimensions.maxWidth, 'width', 0.9),
};

const dialingCode: TextStyle = {
  fontSize: FontSize.regular,
  ...getFontFace(),
  padding: Spacing.quarter,
  paddingLeft: 0,
};

const errorMessageText: TextStyle = {
  alignSelf: 'center',
  color: RedScale.regular,
  ...getFontFace(),
  fontSize: FontSize.large,
  paddingHorizontal: Spacing.threeQuarters,
  paddingTop: Spacing.threeQuarters,
};

const pinContainer: ViewStyle = {
  alignSelf: 'center',
  display: 'flex',
  flexDirection: 'row',
  paddingTop: 15,
  width: getDimension(LocalDimensions.maxWidth, 'width', 0.9),
};
const bodyPinText: TextStyle = {
  alignSelf: 'flex-start',
  color: GreyScale.lighterDark,
  ...getFontFace(),
  fontSize: FontSize.small,
  paddingBottom: Spacing.threeQuarters,
  paddingHorizontal: Spacing.threeQuarters,
  paddingTop: Spacing.threeQuarters,
  width: getDimension(LocalDimensions.maxWidth, 'width', 0.8),
  paddingLeft: 0,
};
const editButtonViewStyle: ViewStyle = {
  marginBottom: -22,
};

const editButtonIconTextStyle: TextStyle = {
  fontSize: IconSize.small,
  marginLeft: -44,
};

const paddingHeader: ViewStyle = {
  paddingLeft: Spacing.threeQuarters,
};

const footerContainerViewStyle: ViewStyle = {
  paddingHorizontal: Spacing.times1pt5,
  paddingTop: Spacing.times1pt5,
  justifyContent: 'flex-end',
  paddingBottom: Spacing.times3,
};

const headerRxContainerHeight = 110;

const bodyViewStyle: ViewStyle = {
  alignSelf: 'stretch',
  height: getContainerHeightMinusHeader() - headerRxContainerHeight,
};

const basePickerViewStyle: ViewStyle = {
  alignSelf: 'center',
  width: getDimension(LocalDimensions.maxWidth, 'width', 0.9),
};

export const editMemberProfileScreenStyle: IEditMemberProfileScreenStyle = {
  bodyInputText,
  bodyMobileInfoText,
  bodyPinText,
  bodyPlaceholderText,
  bodyViewStyle,
  dialingCode,
  editButtonViewStyle,
  editButtonIconTextStyle,
  errorMessageText,
  headerNameText,
  headerRxContainerText,
  headerRxIdText,
  headerRxTitleText,
  paddingHeader,
  pinContainer,
  emailAddressContainer,
  textContainer,
  footerContainerViewStyle,
  basePickerViewStyle,
};
