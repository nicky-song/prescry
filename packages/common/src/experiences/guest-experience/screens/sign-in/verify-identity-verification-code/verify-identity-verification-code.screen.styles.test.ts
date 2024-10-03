// Copyright 2021 Prescryptive Health, Inc.

import {
  IVerifyIdentifyVerificationCodeStyles,
  verifyIdentityVerificationCodeStyles,
} from './verify-identity-verification-code.screen.styles';
import { Spacing } from '../../../../../theming/spacing';
import { NotificationColor } from '../../../../../theming/colors';
import { FontSize } from '../../../../../theming/fonts';

describe('verifyIdentityVerificationCodeStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IVerifyIdentifyVerificationCodeStyles = {
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

    expect(verifyIdentityVerificationCodeStyles).toEqual(expectedStyles);
  });
});
