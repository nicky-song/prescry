// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IShoppingContext, ShoppingContext } from './shopping.context';

export const useShoppingContext = (): IShoppingContext =>
  useContext(ShoppingContext);
