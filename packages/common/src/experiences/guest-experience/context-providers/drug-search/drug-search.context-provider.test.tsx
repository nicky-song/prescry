// Copyright 2021 Prescryptive Health, Inc.

import React, { useReducer } from 'react';
import renderer from 'react-test-renderer';
import { DrugSearchContextProvider } from './drug-search.context-provider';
import { DrugSearchContext, IDrugSearchContext } from './drug-search.context';
import { ITestContainer } from '../../../../testing/test.container';
import {
  defaultDrugSearchState,
  IDrugSearchState,
} from '../../state/drug-search/drug-search.state';
import { drugSearchReducer } from '../../state/drug-search/drug-search.reducer';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useReducer: jest.fn(),
}));
const useReducerMock = useReducer as jest.Mock;

jest.mock('./drug-search.context', () => ({
  DrugSearchContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('DrugSearchContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useReducerMock.mockReturnValue([{}, jest.fn()]);
  });

  it('calls useReducer with expected arguments', () => {
    renderer.create(
      <DrugSearchContextProvider>
        <ChildMock />
      </DrugSearchContextProvider>
    );

    const initialState: IDrugSearchState = defaultDrugSearchState;
    expect(useReducerMock).toHaveBeenCalledWith(
      drugSearchReducer,
      initialState
    );
  });

  it('renders as context provider with expected properties', () => {
    const stateMock: IDrugSearchState = defaultDrugSearchState;
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <DrugSearchContextProvider>
        <ChildMock />
      </DrugSearchContextProvider>
    );

    const provider = testRenderer.root.findByType(DrugSearchContext.Provider);

    const expectedContext: IDrugSearchContext = {
      drugSearchState: stateMock,
      drugSearchDispatch: dispatchMock,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
