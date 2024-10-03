// Copyright 2022 Prescryptive Health, Inc.

import React, { useReducer } from 'react';
import renderer from 'react-test-renderer';
import { AccountAndFamilyContextProvider } from './account-and-family.context-provider';
import {
  AccountAndFamilyContext,
  IAccountAndFamilyContext,
} from './account-and-family.context';
import { ITestContainer } from '../../../../testing/test.container';
import {
  defaultAccountAndFamilyState,
  IAccountAndFamilyState,
} from '../../state/account-and-family/account-and-family.state';
import { accountAndFamilyReducer } from '../../state/account-and-family/account-and-family.reducer';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useReducer: jest.fn(),
}));
const useReducerMock = useReducer as jest.Mock;

jest.mock('./account-and-family.context', () => ({
  AccountAndFamilyContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('AccountAndFamilyContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useReducerMock.mockReturnValue([{}, jest.fn()]);
  });

  it('calls useReducer with expected arguments', () => {
    renderer.create(
      <AccountAndFamilyContextProvider>
        <ChildMock />
      </AccountAndFamilyContextProvider>
    );

    const initialState: IAccountAndFamilyState = defaultAccountAndFamilyState;
    expect(useReducerMock).toHaveBeenCalledWith(
      accountAndFamilyReducer,
      initialState
    );
  });

  it('renders as context provider with expected properties', () => {
    const stateMock: IAccountAndFamilyState = defaultAccountAndFamilyState;
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <AccountAndFamilyContextProvider>
        <ChildMock />
      </AccountAndFamilyContextProvider>
    );

    const provider = testRenderer.root.findByType(
      AccountAndFamilyContext.Provider
    );

    const expectedContext: IAccountAndFamilyContext = {
      accountAndFamilyState: stateMock,
      accountAndFamilyDispatch: dispatchMock,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
