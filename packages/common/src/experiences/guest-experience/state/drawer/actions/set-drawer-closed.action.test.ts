// Copyright 2022 Prescryptive Health, Inc.

import { setDrawerClosedAction } from './set-drawer-closed.action';

describe('setDrawerClosedAction', () => {
  it('returns action', () => {
    const action = setDrawerClosedAction();

    expect(action.type).toEqual('DRAWER_CLOSED');
    expect(action.payload).toEqual({ status: 'closed' });
  });
});
