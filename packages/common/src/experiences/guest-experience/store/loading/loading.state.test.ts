// Copyright 2021 Prescryptive Health, Inc.

import { defaultLoadingState, IReduxLoadingState } from './loading.state';

describe('LoadingState', () => {
  it('has expected default state', () => {
    const expectedState: IReduxLoadingState = {
      count: 0,
    };

    expect(defaultLoadingState).toEqual(expectedState);
  });
});
