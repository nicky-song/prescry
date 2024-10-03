// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../../../theming/spacing';

export interface ISendLinkFormStyles {
  containerViewStyle: ViewStyle;
  sendLinkButtonViewStyle: ViewStyle;
  getALinkTextStyle: TextStyle;
  phoneInputViewStyle: ViewStyle;
}

export const sendLinkFormStyles: ISendLinkFormStyles = {
  containerViewStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendLinkButtonViewStyle: {
    marginLeft: Spacing.base,
  },
  getALinkTextStyle: {
    marginBottom: Spacing.times1pt5,
  },
  phoneInputViewStyle: {
    maxWidth: 240,
  },
};
