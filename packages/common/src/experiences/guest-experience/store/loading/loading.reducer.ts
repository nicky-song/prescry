// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { LoadingAction } from './actions/loading.action';
import { defaultLoadingState, IReduxLoadingState } from './loading.state';

export type LoadingReducer = Reducer<IReduxLoadingState, LoadingAction>;

export const loadingReducer: LoadingReducer = (
  state: IReduxLoadingState = defaultLoadingState,
  action: LoadingAction
) => {
  switch (action.type) {
    case 'LOADING_SHOW': {
      return {
        ...state,
        ...action.payload,
        count: state.count + 1,
      };
    }

    case 'LOADING_HIDE': {
      const updatedCount = state.count > 0 ? state.count - 1 : 0;
      const showMessage = updatedCount ? state.showMessage : undefined;
      const message = updatedCount ? state.message : undefined;

      return {
        ...state,
        count: updatedCount,
        showMessage,
        message,
      };
    }

    default: {
      return state;
    }
  }
};
