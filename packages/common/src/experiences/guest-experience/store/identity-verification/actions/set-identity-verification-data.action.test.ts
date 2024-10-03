// Copyright 2021 Prescryptive Health, Inc.

import { setIdentityVerificationDataAction } from './set-identity-verification-data.action';

describe('setIdentityVerificationDataAction', () => {
  it('returns action', () => {
    const data = {
      maskedEmail: 'masked-email',
      maskedPhoneNumber: 'masked-phone-number',
    };

    const action = setIdentityVerificationDataAction(data);
    expect(action.type).toEqual('SET_IDENTITY_VERIFICATION_DATA');
    expect(action.payload).toEqual(data);
  });
});
