// Copyright 2018 Prescryptive Health, Inc.

import {
  IMissingAccountState,
  supportErrorScreenReducer,
} from './support-error.reducer';
import {
  ISetMissingAccountErrorMessageAction,
  MissingAccountActionKeys,
  MissingAccountActionTypes,
} from './support-error.reducer.actions';

const initialState: IMissingAccountState = {
  errorBackNavigationType: 'NavigateBackOneAndTryAgain',
  errorMessage: undefined,
};

describe('supportErrorScreenReducer', () => {
  it('should set errorMessage with errorBackNavigationType', () => {
    const action: ISetMissingAccountErrorMessageAction = {
      payload: {
        errorBackNavigationType: 'LogoutAndStartOverAtLogin',
        errorMessage: 'you have tried too many times, please wait 10 minutes',
      },
      type: MissingAccountActionKeys.SET_MISSING_ACCOUNT_ERROR_MESSAGE,
    };
    const state = supportErrorScreenReducer(initialState, action);
    expect(state.errorMessage).toBe(action.payload.errorMessage);
    expect(state.errorBackNavigationType).toBe(
      action.payload.errorBackNavigationType
    );
  });

  it('should return default state', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as MissingAccountActionTypes;
    const state = supportErrorScreenReducer(undefined, action);
    expect(state).toEqual(initialState);
  });
});
