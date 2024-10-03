// Copyright 2021 Prescryptive Health, Inc.

import { resetIdentityVerificationCodeSentAction } from './reset-identity-verification-code-sent.action';

describe('resetIdentityVerificationCodeSentAction', () => {
  it('returns action', () => {
    const action = resetIdentityVerificationCodeSentAction();
    expect(action.type).toEqual('RESET_IDENTITY_VERIFICATION_CODE_SENT');
    expect(action.payload).toBeUndefined();
  });
});
