// Copyright 2022 Prescryptive Health, Inc.

import { setDrawerClosedAction } from '../actions/set-drawer-closed.action';
import { DrawerDispatch } from '../dispatch/drawer.dispatch';

export const setDrawerClosedDispatch = (dispatch: DrawerDispatch): void => {
  dispatch(setDrawerClosedAction());
};
