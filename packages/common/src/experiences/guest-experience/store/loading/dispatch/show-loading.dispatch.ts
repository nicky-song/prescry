// Copyright 2021 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { LoadingAction } from '../actions/loading.action';
import { showLoadingAction } from '../actions/show-loading.action';

export const showLoadingDispatch = (
  dispatch: Dispatch<LoadingAction>,
  showMessage?: boolean,
  message?: string
) => {
  dispatch(showLoadingAction(showMessage, message));
};
