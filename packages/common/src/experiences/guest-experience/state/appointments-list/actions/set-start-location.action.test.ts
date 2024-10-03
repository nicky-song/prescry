// Copyright 2021 Prescryptive Health, Inc.

import { setStartLocationAction } from './set-start-location.action';

describe('setStartLocationAction', () => {
  it('returns action', () => {
    const action = setStartLocationAction(999);
    expect(action.type).toEqual('SET_START');
    expect(action.payload).toEqual({start: 999});
  });
});