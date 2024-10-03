// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IPhoneNumberVerificationScreenStyle {
  headerView: ViewStyle;
  headingTextStyle: TextStyle;
  bodyViewStyle: ViewStyle;
}

export const phoneNumberVerificationScreenStyle: IPhoneNumberVerificationScreenStyle =
  {
    headerView: {
      flexGrow: 0,
      alignItems: 'stretch',
      alignSelf: 'stretch',
    },
    headingTextStyle: {
      marginBottom: Spacing.base,
    },
    bodyViewStyle: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
  };
