// Copyright 2021 Prescryptive Health, Inc.

import { hideLoadingAction, IHideLoadingAction } from './hide-loading.action';

describe('hideLoadingAction', () => {
  it('returns action', () => {
    const expectedAction: IHideLoadingAction = {
      type: 'LOADING_HIDE',
      payload: {},
    };
    expect(hideLoadingAction()).toEqual(expectedAction);
  });
});
