// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IPhoneNumberVerificationContainerStyles {
  buttonResendCodeViewStyle: ViewStyle;
  verificationInputTextStyle: TextStyle;
  bodyContentContainerViewStyle: ViewStyle;
  oneTimeCodeVerificationViewStyle: ViewStyle;
}

export const phoneNumberVerificationContainerStyles: IPhoneNumberVerificationContainerStyles =
  {
    buttonResendCodeViewStyle: {
      width: 'auto',
    },

    verificationInputTextStyle: {
      marginTop: Spacing.times1pt5,
      marginBottom: Spacing.times1pt5,
    },

    bodyContentContainerViewStyle: {
      flexGrow: 0,
    },

    oneTimeCodeVerificationViewStyle: {
      marginTop: Spacing.base,
    },
  };
