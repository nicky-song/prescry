// Copyright 2021 Prescryptive Health, Inc.

import React, { useReducer } from 'react';
import renderer from 'react-test-renderer';
import { ShoppingContextProvider } from './shopping.context-provider';
import { ShoppingContext, IShoppingContext } from './shopping.context';
import {
  IShoppingState,
  defaultShoppingState,
} from '../../state/shopping/shopping.state';
import { shoppingReducer } from '../../state/shopping/shopping.reducer';
import { ITestContainer } from '../../../../testing/test.container';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useReducer: jest.fn(),
}));
const useReducerMock = useReducer as jest.Mock;

jest.mock('./shopping.context', () => ({
  ShoppingContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('ShoppingContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useReducerMock.mockReturnValue([{}, jest.fn()]);
  });

  it('calls useReducer with expected arguments', () => {
    renderer.create(
      <ShoppingContextProvider>
        <ChildMock />
      </ShoppingContextProvider>
    );

    const initialState: IShoppingState = defaultShoppingState;
    expect(useReducerMock).toHaveBeenCalledWith(shoppingReducer, initialState);
  });

  it('renders as context provider with expected properties', () => {
    const stateMock: IShoppingState = defaultShoppingState;
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <ShoppingContextProvider>
        <ChildMock />
      </ShoppingContextProvider>
    );

    const provider = testRenderer.root.findByType(ShoppingContext.Provider);

    const expectedContext: IShoppingContext = {
      shoppingState: stateMock,
      shoppingDispatch: dispatchMock,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
