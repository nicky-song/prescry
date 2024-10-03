// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  IPhoneNumberVerificationContainerStyles,
  phoneNumberVerificationContainerStyles,
} from './phone-number-verification-container.styles';

describe('phoneNumberVerificationContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPhoneNumberVerificationContainerStyles = {
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
    expect(phoneNumberVerificationContainerStyles).toEqual(expectedStyles);
  });
});
