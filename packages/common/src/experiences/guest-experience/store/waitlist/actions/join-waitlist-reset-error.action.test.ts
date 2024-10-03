// Copyright 2021 Prescryptive Health, Inc.

import { joinWaitlistResetErrorAction } from './join-waitlist-reset-error.action';

describe('joinWaitlistResetErrorAction', () => {
  it('returns action', () => {
    const action = joinWaitlistResetErrorAction();
    expect(action.type).toEqual('JOIN_WAITLIST_RESET_ERROR');
    expect(action.payload).toEqual(undefined);
  });
});
