// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { NotificationColor } from '../../../../../theming/colors';
import { FontSize } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';

export interface IVerifyIdentifyVerificationCodeStyles {
  buttonViewStyle: ViewStyle;
  bodyContainerViewStyle: ViewStyle;
  headingTextStyle: TextStyle;
  resendCodeViewStyle: ViewStyle;
  oneTimeCodeViewStyle: ViewStyle;
  bodyViewStyle: ViewStyle;
  errorMessageTextStyle: TextStyle;
  resendCodeConfirmationTextStyle: TextStyle;
}

export const verifyIdentityVerificationCodeStyles: IVerifyIdentifyVerificationCodeStyles = {
  buttonViewStyle: { marginTop: Spacing.times2, flexGrow: 0 },
  bodyContainerViewStyle: {
    justifyContent: 'space-between',
  },
  headingTextStyle: {
    marginBottom: Spacing.base,
  },
  resendCodeViewStyle: {
    marginTop: Spacing.times1pt5,
  },
  oneTimeCodeViewStyle: {
    marginTop: Spacing.times1pt5,
  },
  bodyViewStyle: {
    flexGrow: 0,
  },
  errorMessageTextStyle: {
    marginTop: Spacing.base,
    color: NotificationColor.red,
  },
  resendCodeConfirmationTextStyle: {
    fontSize: FontSize.small,
    marginTop: Spacing.half,
  },
};
