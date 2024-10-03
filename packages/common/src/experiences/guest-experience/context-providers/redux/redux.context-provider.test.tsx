// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { ReduxContextProvider } from './redux.context-provider';
import { ReduxContext, IReduxContext } from './redux.context';
import { ITestContainer } from '../../../../testing/test.container';

jest.mock('./redux.context', () => ({
  ReduxContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('ReduxContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as context provider', () => {
    const getStateMock = jest.fn();
    const dispatchMock = jest.fn();

    const testRenderer = renderer.create(
      <ReduxContextProvider getState={getStateMock} dispatch={dispatchMock}>
        <ChildMock />
      </ReduxContextProvider>
    );

    const provider = testRenderer.root.findByType(ReduxContext.Provider);

    const expectedContext: IReduxContext = {
      getState: getStateMock,
      dispatch: dispatchMock,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
