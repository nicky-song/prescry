// Copyright 2018 Prescryptive Health, Inc.

import {
  MissingAccountActionKeys,
  MissingAccountActionTypes,
} from './support-error.reducer.actions';

export type SupportErrorBackNavigationType =
  | 'LogoutAndStartOverAtLogin'
  | 'NavigateBackOneAndTryAgain';

export interface IMissingAccountState {
  errorMessage?: string;
  errorBackNavigationType?: SupportErrorBackNavigationType;
}

const DefaultMissingAccountState: IMissingAccountState = {
  errorBackNavigationType: 'NavigateBackOneAndTryAgain',
  errorMessage: undefined,
};

export const supportErrorScreenReducer = (
  state: IMissingAccountState = DefaultMissingAccountState,
  action: MissingAccountActionTypes
) => {
  switch (action.type) {
    case MissingAccountActionKeys.SET_MISSING_ACCOUNT_ERROR_MESSAGE:
      return {
        ...state,
        errorBackNavigationType: action.payload.errorBackNavigationType,
        errorMessage: action.payload.errorMessage,
      };
  }
  return state;
};
