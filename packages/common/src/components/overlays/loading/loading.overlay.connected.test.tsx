// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { IReduxLoadingState } from '../../../experiences/guest-experience/store/loading/loading.state';
import { RootState } from '../../../experiences/guest-experience/store/root-reducer';
import { ILoadingOverlayProps } from './loading.overlay';
import {
  LoadingOverlayConnected,
  mapStateToProps,
} from './loading.overlay.connected';

jest.mock('react-redux', () => {
  return {
    connect: jest.fn().mockReturnValue(() => jest.fn()),
  };
});

jest.mock('./loading.overlay', () => ({
  LoadingOverlay: () => <div />,
}));

describe('LoadingOverlayConnected', () => {
  it('is defined', () => {
    expect(LoadingOverlayConnected).toBeDefined();
  });
});

it.each([
  [0, false],
  [1, true],
  [2, true],
])(
  'maps state to props (loadingCount: %p)',
  (loadingCountMock: number, isVisibleExpected) => {
    const loadingStateMock: IReduxLoadingState = {
      count: loadingCountMock,
      message: 'message',
      showMessage: true,
    };
    const initialStateMock: Partial<RootState> = {
      loading: loadingStateMock,
    };

    const mapStateToPropsResult = mapStateToProps(
      initialStateMock as RootState
    );

    const expectedProps: ILoadingOverlayProps = {
      showMessage: loadingStateMock.showMessage,
      message: loadingStateMock.message,
      visible: isVisibleExpected,
    };

    expect(mapStateToPropsResult).toEqual(expectedProps);
  }
);
