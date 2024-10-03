// Copyright 2021 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { hideLoadingAction } from '../actions/hide-loading.action';
import { LoadingAction } from '../actions/loading.action';

export const hideLoadingDispatch = (dispatch: Dispatch<LoadingAction>) => {
  dispatch(hideLoadingAction());
};
