// Copyright 2021 Prescryptive Health, Inc.

import { FontSize } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';
import {
  IPhoneNumberLoginScreenStyles,
  phoneNumberLoginScreenStyles,
} from './phone-number-login.screen.styles';

describe('phoneNumberLoginScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPhoneNumberLoginScreenStyles = {
      termsAndConditionsContainerViewStyle: {
        marginBottom: Spacing.times1pt5,
      },
      buttonViewStyleSecondary: {
        marginBottom: Spacing.times1pt5,
      },
      buttonViewStylePrimary: {},
      notHaveAccountViewStyle: {
        marginTop: Spacing.times1pt5,
        alignItems: 'center',
      },
      smallTextStyle: {
        fontSize: FontSize.small,
      },
      bottomContentViewStyle: {
        marginTop: Spacing.times1pt5,
        flex: 1,
        justifyContent: 'flex-end',
      },
      bodyContentContainerViewStyle: {
        flex: 1,
      },
    };

    expect(phoneNumberLoginScreenStyles).toEqual(expectedStyles);
  });
});
