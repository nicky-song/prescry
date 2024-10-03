// Copyright 2022 Prescryptive Health, Inc.

import { setDrawerOpenAction } from './actions/set-drawer-open.action';
import { setDrawerClosedAction } from './actions/set-drawer-closed.action';
import { drawerReducer } from './drawer.reducer';
import { IDrawerState } from './drawer.state';
import { drawerClosedMock, drawerOpenMock } from './drawer.state.test';

describe('drawerReducer', () => {
  it('reduces drawer status set open action (when drawer closed)', () => {
    const action = setDrawerOpenAction();

    const initialState: IDrawerState = drawerClosedMock;

    const reducedState = drawerReducer(initialState, action);

    const expectedState: IDrawerState = drawerOpenMock;

    expect(reducedState).toEqual(expectedState);
  });

  it('reduces drawer status set closed action (when drawer open)', () => {
    const action = setDrawerClosedAction();

    const initialState: IDrawerState = drawerOpenMock;

    const reducedState = drawerReducer(initialState, action);

    const expectedState: IDrawerState = drawerClosedMock;

    expect(reducedState).toEqual(expectedState);
  });
});
