// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import {
  FontSize,
  GreyScale,
  PurpleScale,
  RedScale,
} from '../../../theming/theme';

export interface IRecoveryEmailModalStyles {
  titleContainerViewStyle: ViewStyle;
  titleTextStyle: TextStyle;
  primaryButtonEnabledViewStyle: ViewStyle;
  contentContainerViewStyle: ViewStyle;
  contentTextStyle: TextStyle;
  primaryButtonDisabledViewStyle: ViewStyle;
  textFieldsViewStyle: ViewStyle;
  textFieldsErrorViewStyle: ViewStyle;
  errorViewStyle: ViewStyle;
  errorTextStyle: TextStyle;
}

const titleContainerViewStyle: ViewStyle = {
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  flexDirection: 'row',
  marginBottom: 16,
  alignSelf: 'flex-start',
};

const titleTextStyle: TextStyle = {
  fontSize: FontSize.larger,
  ...getFontFace({ weight: FontWeight.bold }),
  textAlign: 'left',
  height: 'auto',
};

const buttonViewStyle: ViewStyle = {
  width: '100%',
  maxHeight: 48,
  height: 48,
  alignItems: 'center',
  flexDirection: 'row',
};

const primaryButtonEnabledViewStyle: ViewStyle = {
  ...buttonViewStyle,
  backgroundColor: PurpleScale.darkest,
};

const primaryButtonDisabledViewStyle: ViewStyle = {
  ...primaryButtonEnabledViewStyle,
  backgroundColor: GreyScale.light,
};

const contentContainerViewStyle: ViewStyle = {
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  flexDirection: 'row',
  paddingTop: 8,
  paddingBottom: 24,
};

const contentTextStyle: TextStyle = {
  fontSize: FontSize.regular,
  textAlign: 'left',
  height: 'auto',
};

const textFieldsViewStyle: ViewStyle = {
  alignSelf: 'center',
  flexGrow: 1,
  marginBottom: 32,
  marginTop: 0,
  width: '100%',
};

const textFieldsErrorViewStyle: ViewStyle = {
  ...textFieldsViewStyle,
  marginBottom: 16,
};

const errorViewStyle: ViewStyle = {
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  alignSelf: 'flex-start',
  flexDirection: 'row',
  marginBottom: 16,
};

const errorTextStyle: TextStyle = {
  fontSize: FontSize.regular,
  ...getFontFace(),
  textAlign: 'left',
  height: 'auto',
  color: RedScale.regular,
};

export const recoveryEmailModalStyles: IRecoveryEmailModalStyles = {
  contentContainerViewStyle,
  contentTextStyle,
  primaryButtonEnabledViewStyle,
  primaryButtonDisabledViewStyle,
  titleContainerViewStyle,
  titleTextStyle,
  textFieldsErrorViewStyle,
  textFieldsViewStyle,
  errorViewStyle,
  errorTextStyle,
};
