// Copyright 2022 Prescryptive Health, Inc.

import { defaultLoadingState } from '../../store/loading/loading.state';
import { ILoadingState } from './loading.state';

describe('LoadingState', () => {
  it('has expected default state', () => {
    const expectedState: ILoadingState = {
      count: 0,
    };

    expect(defaultLoadingState).toEqual(expectedState);
  });
});
