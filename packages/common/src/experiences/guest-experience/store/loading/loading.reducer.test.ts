// Copyright 2021 Prescryptive Health, Inc.

import { hideLoadingAction } from './actions/hide-loading.action';
import { showLoadingAction } from './actions/show-loading.action';
import { loadingReducer } from './loading.reducer';
import { defaultLoadingState, IReduxLoadingState } from './loading.state';

describe('loadingReducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reduces showLoading action', () => {
    const countMock = 1;
    const initialState: IReduxLoadingState = {
      ...defaultLoadingState,
      count: countMock,
    };

    const showMessageMock = true;
    const messageMock = 'message';
    const reducedState = loadingReducer(
      initialState,
      showLoadingAction(showMessageMock, messageMock)
    );

    const expectedState: IReduxLoadingState = {
      ...initialState,
      count: countMock + 1,
      showMessage: showMessageMock,
      message: messageMock,
    };
    expect(reducedState).toEqual(expectedState);
  });

  it.each([
    [2, 1],
    [1, 0],
    [0, 0],
    [-1, 0],
  ])(
    'reduces hideLoading action (initial count: %p)',
    (initialCountMock: number, expectedCount: number) => {
      const initialState: IReduxLoadingState = {
        ...defaultLoadingState,
        count: initialCountMock,
        showMessage: true,
        message: 'message',
      };
      const expectedState: IReduxLoadingState = {
        ...initialState,
        count: expectedCount,
        showMessage: expectedCount > 0 ? initialState.showMessage : undefined,
        message: expectedCount > 0 ? initialState.message : undefined,
      };

      const reducedState = loadingReducer(initialState, hideLoadingAction());

      expect(reducedState).toEqual(expectedState);
    }
  );
});
