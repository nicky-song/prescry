// Copyright 2020 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import {
  IResetNewDependentErrorAction,
  resetNewDependentErrorAction,
} from '../actions/reset-new-dependent-error.action';

export const resetNewDependentErrorAsyncAction = () => {
  return async (dispatch: Dispatch<IResetNewDependentErrorAction>) => {
    await dispatch(resetNewDependentErrorAction());
  };
};
