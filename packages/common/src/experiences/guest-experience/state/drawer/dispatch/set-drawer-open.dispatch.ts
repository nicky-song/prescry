// Copyright 2022 Prescryptive Health, Inc.

import { setDrawerOpenAction } from '../actions/set-drawer-open.action';
import { DrawerDispatch } from '../dispatch/drawer.dispatch';

export const setDrawerOpenDispatch = (dispatch: DrawerDispatch): void => {
  dispatch(setDrawerOpenAction());
};
