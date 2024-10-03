// Copyright 2021 Prescryptive Health, Inc.

import { setIdentityVerificationEmailFlagAction } from './set-identity-verification-email-flag.action';

describe('setIdentityVerificationEmailFlagAction', () => {
  it('returns action', () => {
    const data = {
      recoveryEmailExists: true,
    };

    const action = setIdentityVerificationEmailFlagAction(data);
    expect(action.type).toEqual('SET_IDENTITY_VERIFICATION_EMAIL_FLAG');
    expect(action.payload).toEqual(data);
  });
});
