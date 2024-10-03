// Copyright 2021 Prescryptive Health, Inc.

import React, { useReducer } from 'react';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../../testing/test.container';
import { PastProceduresContextProvider } from './past-procedures.context-provider';
import {
  PastProceduresContext,
  IPastProceduresContext,
} from './past-procedures.context';
import {
  defaultPastProceduresState,
  IPastProceduresListState,
} from '../../state/past-procedures/past-procedures.state';
import { pastProceduresReducer } from '../../state/past-procedures/past-procedures.reducer';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useReducer: jest.fn(),
}));
const useReducerMock = useReducer as jest.Mock;

jest.mock('./past-procedures.context', () => ({
  PastProceduresContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('PastProceduresContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useReducerMock.mockReturnValue([{}, jest.fn()]);
  });

  it('calls useReducer with expected arguments', () => {
    renderer.create(
      <PastProceduresContextProvider>
        <ChildMock />
      </PastProceduresContextProvider>
    );

    const initialState: IPastProceduresListState = defaultPastProceduresState;
    expect(useReducerMock).toHaveBeenCalledWith(
      pastProceduresReducer,
      initialState
    );
  });

  it('renders as context provider with expected properties', () => {
    const stateMock: IPastProceduresListState = defaultPastProceduresState;
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <PastProceduresContextProvider>
        <ChildMock />
      </PastProceduresContextProvider>
    );

    const provider = testRenderer.root.findByType(
      PastProceduresContext.Provider
    );

    const expectedContext: IPastProceduresContext = {
      pastProceduresState: stateMock,
      pastProceduresDispatch: dispatchMock,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
