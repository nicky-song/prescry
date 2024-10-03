// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { getFontFace } from '../../../theming/fonts';
import { FontSize, RedScale } from '../../../theming/theme';

export interface IDateInputStyles {
  containerViewStyle: ViewStyle;
  dayInputViewStyle: ViewStyle;
  fieldErrorTextStyle: TextStyle;
  fieldTextStyle: TextStyle;
  fieldViewStyle: ViewStyle;
  labelTextStyle: TextStyle;
  monthInputTextStyle: TextStyle;
  yearInputViewStyle: ViewStyle;
}

const containerViewStyle: ViewStyle = {
  flexDirection: 'column',
};

const fieldErrorTextStyle: TextStyle = {
  color: RedScale.regular,
  fontSize: FontSize.regular,
};

const fieldTextStyle: TextStyle = {
  display: 'flex',
  flexDirection: 'column',
  fontSize: FontSize.regular,
  marginLeft: 10,
  marginRight: 10,
  ...getFontFace(),
};

const fieldViewStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
};

const labelTextStyle: TextStyle = {
  marginBottom: '.4em',
};

const dayInputViewStyle: ViewStyle = {
  height: 48,
  width: '20vw',
};

const monthInputTextStyle: TextStyle = {
  ...getFontFace(),
  width: '34vw',
};

const yearInputViewStyle: ViewStyle = {
  height: 48,
  width: '24vw',
};

const defaultStyleSheet: IDateInputStyles = {
  containerViewStyle,
  dayInputViewStyle,
  fieldErrorTextStyle,
  fieldTextStyle,
  fieldViewStyle,
  labelTextStyle,
  monthInputTextStyle,
  yearInputViewStyle,
};

export const dateInputStyles = defaultStyleSheet;
