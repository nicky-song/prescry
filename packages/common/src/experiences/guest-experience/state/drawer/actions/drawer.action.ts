// Copyright 2022 Prescryptive Health, Inc.

import { IDrawerState } from '../drawer.state';

type ActionKeys = 'DRAWER_OPEN' | 'DRAWER_CLOSED';

export interface IDrawerAction<T extends ActionKeys> {
  readonly type: T;
  readonly payload: Partial<IDrawerState>;
}

export type DrawerAction = IDrawerAction<ActionKeys>;
