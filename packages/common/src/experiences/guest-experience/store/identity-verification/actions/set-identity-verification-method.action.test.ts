// Copyright 2021 Prescryptive Health, Inc.

import { setIdentityVerificationMethodAction } from './set-identity-verification-method.action';

describe('setIdentityVerificationMethodAction', () => {
  it('returns action', () => {
    const data = {
      selectedVerificationMethod: 'verification-method',
    };

    const action = setIdentityVerificationMethodAction(data);
    expect(action.type).toEqual('SET_IDENTITY_VERIFICATION_METHOD');
    expect(action.payload).toEqual(data);
  });
});
