// Copyright 2021 Prescryptive Health, Inc.

import { ErrorInviteCode } from './error-invite-code';

describe('ErrorInviteCode', () => {
  it('should create instance of ErrorInviteCode', () => {
    const error = new ErrorInviteCode('fake-error');
    expect(error).toBeInstanceOf(ErrorInviteCode);
    expect(error).toEqual(new Error('fake-error'));
  });
  it('should create assign apiType property if provided', () => {
    const error = new ErrorInviteCode('fake-error', 'fake-api');
    expect(error).toBeInstanceOf(ErrorInviteCode);
    expect(error.apiType).toEqual('fake-api');
  });
});
