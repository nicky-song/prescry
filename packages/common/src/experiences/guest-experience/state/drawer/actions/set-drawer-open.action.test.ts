// Copyright 2022 Prescryptive Health, Inc.

import { setDrawerOpenAction } from './set-drawer-open.action';

describe('setDrawerOpenAction', () => {
  it('returns action', () => {
    const action = setDrawerOpenAction();

    expect(action.type).toEqual('DRAWER_OPEN');
    expect(action.payload).toEqual({ status: 'open' });
  });
});
