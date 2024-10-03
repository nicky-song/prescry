// Copyright 2022 Prescryptive Health, Inc.

import { IDrawerAction } from './drawer.action';

export type ISetDrawerClosedAction = IDrawerAction<'DRAWER_CLOSED'>;

export const setDrawerClosedAction = (): ISetDrawerClosedAction => ({
  type: 'DRAWER_CLOSED',
  payload: { status: 'closed' },
});
