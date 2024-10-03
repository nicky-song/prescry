// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { ShoppingDispatch } from '../../state/shopping/dispatch/shopping.dispatch';
import {
  defaultShoppingState,
  IShoppingState,
} from '../../state/shopping/shopping.state';

export interface IShoppingContext {
  readonly shoppingState: IShoppingState;
  readonly shoppingDispatch: ShoppingDispatch;
}

export const ShoppingContext = createContext<IShoppingContext>({
  shoppingState: defaultShoppingState,
  shoppingDispatch: () => {
    return;
  },
});
