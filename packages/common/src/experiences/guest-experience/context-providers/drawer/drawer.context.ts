// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';
import { DrawerDispatch } from '../../state/drawer/dispatch/drawer.dispatch';
import {
  defaultDrawerState,
  IDrawerState,
} from '../../state/drawer/drawer.state';

export interface IDrawerContext {
  readonly drawerState: IDrawerState;
  readonly drawerDispatch: DrawerDispatch;
}

export const DrawerContext = createContext<IDrawerContext>({
  drawerState: defaultDrawerState,
  drawerDispatch: () => {
    return;
  },
});
