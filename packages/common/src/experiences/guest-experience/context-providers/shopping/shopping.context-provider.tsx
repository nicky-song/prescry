// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, useReducer } from 'react';
import { ShoppingContext } from './shopping.context';
import {
  shoppingReducer,
  ShoppingReducer,
} from '../../state/shopping/shopping.reducer';
import { defaultShoppingState } from '../../state/shopping/shopping.state';

export const ShoppingContextProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer<ShoppingReducer>(
    shoppingReducer,
    defaultShoppingState
  );
  return (
    <ShoppingContext.Provider
      value={{
        shoppingState: state,
        shoppingDispatch: dispatch,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};
