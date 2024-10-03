// Copyright 2018 Prescryptive Health, Inc.

import { RootState } from '../root-reducer';
import { LoadingAction } from '../loading/actions/loading.action';
import { hideLoadingDispatch } from '../loading/dispatch/hide-loading.dispatch';
import { showLoadingDispatch } from '../loading/dispatch/show-loading.dispatch';
import { Dispatch } from 'react';

export function dataLoadingAction<T, A>(
  reducerAction: (args: A) => T,
  argsReducerAction: A,
  showMessage?: boolean,
  messageMainHeader?: string
) {
  return async (
    dispatch: Dispatch<LoadingAction | T>,
    _getState: () => RootState
  ) => {
    try {
      showLoadingDispatch(dispatch, showMessage, messageMainHeader);
      await dispatch(reducerAction(argsReducerAction));
    } finally {
      hideLoadingDispatch(dispatch);
    }
  };
}
