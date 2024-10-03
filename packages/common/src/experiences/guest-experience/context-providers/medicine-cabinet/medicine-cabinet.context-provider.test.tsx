// Copyright 2021 Prescryptive Health, Inc.

import React, { useReducer } from 'react';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../../testing/test.container';
import { MedicineCabinetReducer } from '../../state/medicine-cabinet/medicine-cabinet.reducer';
import {
  IMedicineCabinetState,
  defaultMedicineCabinetState,
} from '../../state/medicine-cabinet/medicine-cabinet.state';
import {
  MedicineCabinetContext,
  IMedicineCabinetContext,
} from './medicine-cabinet.context';
import { MedicineCabinetContextProvider } from './medicine-cabinet.context-provider';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useReducer: jest.fn(),
}));
const useReducerMock = useReducer as jest.Mock;

jest.mock('./medicine-cabinet.context', () => ({
  MedicineCabinetContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('MedicineCabinetContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useReducerMock.mockReturnValue([{}, jest.fn()]);
  });

  it('calls useReducer with expected arguments', () => {
    renderer.create(
      <MedicineCabinetContextProvider>
        <ChildMock />
      </MedicineCabinetContextProvider>
    );

    const initialState: IMedicineCabinetState = defaultMedicineCabinetState;
    expect(useReducerMock).toHaveBeenCalledWith(
      MedicineCabinetReducer,
      initialState
    );
  });

  it('renders as context provider with expected properties', () => {
    const stateMock: IMedicineCabinetState = defaultMedicineCabinetState;
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <MedicineCabinetContextProvider>
        <ChildMock />
      </MedicineCabinetContextProvider>
    );

    const provider = testRenderer.root.findByType(
      MedicineCabinetContext.Provider
    );

    const expectedContext: IMedicineCabinetContext = {
      medicineCabinetState: stateMock,
      medicineCabinetDispatch: dispatchMock,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
