// Copyright 2022 Prescryptive Health, Inc.

import React, { useReducer } from 'react';
import renderer from 'react-test-renderer';
import { DrawerContextProvider } from './drawer.context-provider';
import { DrawerContext, IDrawerContext } from './drawer.context';
import { ITestContainer } from '../../../../testing/test.container';
import { IDrawerState } from '../../state/drawer/drawer.state';
import { DrawerDispatch } from '../../state/drawer/dispatch/drawer.dispatch';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useReducer: jest.fn(),
}));
const useReducerMock = useReducer as jest.Mock;

jest.mock('./drawer.context', () => ({
  DrawerContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

const stateMock: IDrawerState = {
  status: 'closed',
};

const dispatchMock: DrawerDispatch = jest.fn();

describe('DrawerContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);
  });

  it('renders as context provider', () => {
    const testRenderer = renderer.create(
      <DrawerContextProvider>
        <ChildMock />
      </DrawerContextProvider>
    );

    const provider = testRenderer.root.findByType(DrawerContext.Provider);

    const expectedContext: IDrawerContext = {
      drawerState: stateMock,
      drawerDispatch: dispatchMock,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
