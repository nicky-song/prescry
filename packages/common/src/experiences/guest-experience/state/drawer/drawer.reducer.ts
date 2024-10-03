// Copyright 2022 Prescryptive Health, Inc.

import { Reducer } from 'react';
import { DrawerAction } from './actions/drawer.action';
import { IDrawerState } from './drawer.state';

export type DrawerReducer = Reducer<IDrawerState, DrawerAction>;

export const drawerReducer: DrawerReducer = (
  state: IDrawerState,
  action: DrawerAction
): IDrawerState => {
  const { payload } = action;

  return { ...state, ...payload };
};
