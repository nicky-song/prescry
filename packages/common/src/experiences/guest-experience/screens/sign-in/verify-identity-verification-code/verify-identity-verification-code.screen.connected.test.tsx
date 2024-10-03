// Copyright 2021 Prescryptive Health, Inc.

import { RootState } from '../../../store/root-reducer';
import { IVerifyIdentityVerificationCodeScreenDataProps } from './verify-identity-verification-code.screen';
import { mapStateToProps } from './verify-identity-verification-code.screen.connected';

describe('verifyIdentityVerificationCodeScreenConnected', () => {
  it('maps state', () => {
    const mappedProps: IVerifyIdentityVerificationCodeScreenDataProps =
      mapStateToProps({
        identityVerification: {
          selectedVerificationMethod: 'EMAIL',
          maskedEmail: 'masked-email',
          maskedPhoneNumber: 'masked-phone-number',
        },
      } as RootState);

    const expectedProps: IVerifyIdentityVerificationCodeScreenDataProps = {
      verificationType: 'EMAIL',
      maskedValue: 'masked-email',
    };
    expect(mappedProps).toEqual(expectedProps);
  });
});
