// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { useShoppingContext } from './use-shopping-context.hook';
import { IShoppingContext } from './shopping.context';
import { defaultShoppingState } from '../../state/shopping/shopping.state';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useShoppingContext', () => {
  it('returns expected context', () => {
    const contextMock: IShoppingContext = {
      shoppingState: defaultShoppingState,
      shoppingDispatch: jest.fn(),
    };
    useContextMock.mockReturnValue(contextMock);

    const context: IShoppingContext = useShoppingContext();
    expect(context).toEqual(contextMock);
  });
});
