// Copyright 2021 Prescryptive Health, Inc.

import { joinWaitlistErrorAction } from './join-waitlist-error.action';

describe('joinWaitlistErrorAction', () => {
  it('returns action', () => {
    const action = joinWaitlistErrorAction('error');
    expect(action.type).toEqual('JOIN_WAITLIST_ERROR');
    expect(action.payload).toEqual({ error: 'error' });
  });
});
