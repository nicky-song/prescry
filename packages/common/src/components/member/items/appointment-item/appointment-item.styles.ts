// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { BlueScale, FontSize, GreyScale } from '../../../../theming/theme';

const cardViewStyle: ViewStyle = {
  alignItems: 'center',
  height: 'auto',
  flex: 1,
  overflow: 'hidden',
  borderRadius: 0,
  backgroundColor: GreyScale.lightest,
  borderWidth: 0,
  borderBottomWidth: 1,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 12,
  borderColor: GreyScale.lighterDark,
  flexDirection: 'row',
  marginTop: 0,
};

const labelContentViewStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  marginVertical: 8,
};

const labelTextStyle: TextStyle = {
  flex: 1,
  flexBasis: '85px',
  color: GreyScale.dark,
  fontSize: FontSize.regular,
  ...getFontFace(),
};

const contentTextStyle: TextStyle = {
  flex: 3,
  flexBasis: '210px',
  color: GreyScale.darkest,
  fontSize: FontSize.regular,
  ...getFontFace({ weight: FontWeight.semiBold }),
  lineHeight: undefined,
};

const titleTextStyle: TextStyle = {
  color: BlueScale.darker,
  fontSize: FontSize.regular,
  ...getFontFace({ weight: FontWeight.bold }),
  textAlign: 'left',
  lineHeight: undefined,
};

const textContainerViewStyle: ViewStyle = {
  flexDirection: 'column',
  display: 'flex',
  flexGrow: 1,
  flex: 1,
};

const iconContainerViewStyle: ViewStyle = {
  flexDirection: 'column',
  display: 'flex',
  flexBasis: 32,
  flexGrow: 0,
  flexShrink: 0,
  alignSelf: 'center',
};

const iconViewStyle: ViewStyle = {
  width: 26,
  height: 26,
  maxHeight: 26,
  alignItems: 'flex-end',
};

const iconStyle = {
  color: GreyScale.darkest,
  fontSize: FontSize.larger,
};
export const appointmentItemStyle = {
  titleTextStyle,
  cardViewStyle,
  textContainerViewStyle,
  labelContentViewStyle,
  labelTextStyle,
  contentTextStyle,
  iconContainerViewStyle,
  iconViewStyle,
  iconStyle,
};
