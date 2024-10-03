// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultShoppingState } from '../../state/shopping/shopping.state';
import { IShoppingContext, ShoppingContext } from './shopping.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('ShoppingContext', () => {
  it('creates context', () => {
    expect(ShoppingContext).toBeDefined();

    const expectedContext: IShoppingContext = {
      shoppingState: defaultShoppingState,
      shoppingDispatch: expect.any(Function),
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});
