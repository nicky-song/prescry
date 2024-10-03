// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../../testing/test.container';
import {
  defaultLoadingState,
  ILoadingState,
} from '../../state/loading/loading.state';
import { LoadingContext, ILoadingContext } from './loading.context';
import { LoadingContextProvider } from './loading.context-provider';

jest.mock('./loading.context', () => ({
  LoadingContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('LoadingContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as context provider with expected properties', () => {
    const stateMock: ILoadingState = defaultLoadingState;

    const testRenderer = renderer.create(
      <LoadingContextProvider loadingState={defaultLoadingState}>
        <ChildMock />
      </LoadingContextProvider>
    );

    const provider = testRenderer.root.findByType(LoadingContext.Provider);

    const expectedContext: ILoadingContext = {
      loadingState: stateMock,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
