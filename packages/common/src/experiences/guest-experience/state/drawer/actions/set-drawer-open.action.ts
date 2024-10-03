// Copyright 2022 Prescryptive Health, Inc.

import { IDrawerAction } from './drawer.action';

export type ISetDrawerOpenAction = IDrawerAction<'DRAWER_OPEN'>;

export const setDrawerOpenAction = (): ISetDrawerOpenAction => ({
  type: 'DRAWER_OPEN',
  payload: { status: 'open' },
});
