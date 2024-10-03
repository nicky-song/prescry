// Copyright 2022 Prescryptive Health, Inc.

import { defaultDrawerState, IDrawerState } from './drawer.state';

export const drawerOpenMock: IDrawerState = {
  status: 'open',
};

export const drawerClosedMock: IDrawerState = {
  status: 'closed',
};

describe('DrugSearchState', () => {
  it('has expected default state', () => {
    const expectedState: IDrawerState = drawerClosedMock;

    expect(defaultDrawerState).toEqual(expectedState);
  });
});
