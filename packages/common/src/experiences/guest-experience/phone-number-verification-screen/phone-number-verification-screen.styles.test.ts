// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  IPhoneNumberVerificationScreenStyle,
  phoneNumberVerificationScreenStyle,
} from './phone-number-verification-screen.styles';

describe('phoneNumberVerificationScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyle: IPhoneNumberVerificationScreenStyle = {
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

    expect(phoneNumberVerificationScreenStyle).toEqual(expectedStyle);
  });
});
