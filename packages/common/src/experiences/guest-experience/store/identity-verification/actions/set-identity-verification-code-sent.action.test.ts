// Copyright 2021 Prescryptive Health, Inc.

import { setIdentityVerificationCodeSentAction } from './set-identity-verification-code-sent.action';

describe('setIdentityVerificationCodeSentAction', () => {
  it('returns action', () => {
    const data = {
      isVerificationCodeSent: true,
    };

    const action = setIdentityVerificationCodeSentAction(data);
    expect(action.type).toEqual('SET_IDENTITY_VERIFICATION_CODE_SENT');
    expect(action.payload).toEqual(data);
  });
});
