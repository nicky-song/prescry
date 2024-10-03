// Copyright 2021 Prescryptive Health, Inc.

import { CSSProperties } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { Spacing } from '../../../theming/spacing';
import { GreyScale, FontSize } from '../../../theming/theme';

const phoneNumberLoginContainerView: ViewStyle = {
  flexGrow: 0,
};

const maskedInputStyle: CSSProperties = {
  borderColor: GreyScale.light,
  borderWidth: 1,
  borderRadius: BorderRadius.normal,
  fontSize: FontSize.regular,
  paddingTop: Spacing.threeQuarters,
  paddingRight: Spacing.base,
  paddingBottom: Spacing.threeQuarters,
  paddingLeft: Spacing.base,
  textAlign: 'left',
  width: '100%',
};

const maskedTextInputContainerView: ViewStyle = {
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
};

const paragraphText: TextStyle = {
  textAlign: 'left',
  flexBasis: 'auto',
};

const phoneNumberContainer: ViewStyle = {
  alignSelf: 'center',
  flex: 1,
  flexDirection: 'row',
  marginTop: Spacing.times1pt5,
  width: '100%',
};

const unSupportedPhoneNumberText: TextStyle = {
  marginTop: Spacing.threeQuarters,
  textAlign: 'left',
};

const relevantTextAlertsMessageStyle: TextStyle = {
  ...paragraphText,
  textAlign: 'left',
  color: GreyScale.lighterDark,
  fontSize: FontSize.small,
  marginTop: Spacing.times2,
};

const phoneMaskInputViewStyle: ViewStyle = { marginTop: Spacing.times1pt5 };

export const phoneNumberLoginContainerStyles = {
  maskedTextInputContainerView,
  paragraphText,
  phoneNumberContainer,
  phoneNumberLoginContainerView,
  unSupportedPhoneNumberText,
  relevantTextAlertsMessageStyle,
  maskedInputStyle,
  phoneMaskInputViewStyle,
};
