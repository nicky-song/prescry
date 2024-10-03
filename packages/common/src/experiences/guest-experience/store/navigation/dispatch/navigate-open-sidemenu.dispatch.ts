// Copyright 2021 Prescryptive Health, Inc.

import { ReduxDispatch } from '../../../context-providers/redux/redux.context';
import { openDrawerAction } from '../../side-menu/side-menu.reducer.actions';

export const navigateOpenSideMenuDispatch = (dispatch: ReduxDispatch) => {
  dispatch(openDrawerAction());
};
