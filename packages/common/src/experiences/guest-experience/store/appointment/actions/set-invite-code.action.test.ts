// Copyright 2020 Prescryptive Health, Inc.

import { setInviteCodeAction } from './set-invite-code.action';

describe('setInviteCodeAction', () => {
  it('returns action', () => {
    const inviteCodeMock = 'test-invite-code';

    const action = setInviteCodeAction(inviteCodeMock);
    expect(action.type).toEqual('APPOINTMENT_SET_INVITE_CODE');
    expect(action.payload).toEqual(inviteCodeMock);
  });
});
