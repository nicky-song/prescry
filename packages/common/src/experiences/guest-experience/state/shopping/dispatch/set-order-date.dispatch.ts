// Copyright 2021 Prescryptive Health, Inc.

import { ShoppingDispatch } from './shopping.dispatch';
import { orderDateSetAction } from '../actions/order-date-set.action';

export const setOrderDateDispatch = (
  dispatch: ShoppingDispatch,
  orderDate: Date
): void => {
  dispatch(orderDateSetAction(orderDate));
};
