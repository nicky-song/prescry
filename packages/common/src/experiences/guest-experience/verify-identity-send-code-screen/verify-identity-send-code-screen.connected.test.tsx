// Copyright 2021 Prescryptive Health, Inc.

import { RootState } from '../store/root-reducer';
import { IVerifyIdentitySendCodeScreenDataProps } from './verify-identity-send-code-screen';
import { mapStateToProps } from './verify-identity-send-code-screen.connected';

describe('VerifyIdentitySendCodeScreenConnected', () => {
  it('maps state', () => {
    const mappedProps: IVerifyIdentitySendCodeScreenDataProps = mapStateToProps(
      {
        identityVerification: {
          maskedEmail: 'email-address',
          maskedPhoneNumber: 'phone-number',
        },
      } as RootState
    );

    const expectedProps: IVerifyIdentitySendCodeScreenDataProps = {
      maskedEmailAddress: 'email-address',
      maskedPhoneNumber: 'phone-number',
    };
    expect(mappedProps).toEqual(expectedProps);
  });
});
