// Copyright 2021 Prescryptive Health, Inc.

import { IShowLoadingAction, showLoadingAction } from './show-loading.action';

describe('showLoadingAction', () => {
  it('returns action', () => {
    const showMessageMock = true;
    const messageMock = 'message';
    const action = showLoadingAction(showMessageMock, messageMock);

    const expectedAction: IShowLoadingAction = {
      type: 'LOADING_SHOW',
      payload: {
        showMessage: showMessageMock,
        message: messageMock,
      },
    };
    expect(action).toEqual(expectedAction);
  });
});
