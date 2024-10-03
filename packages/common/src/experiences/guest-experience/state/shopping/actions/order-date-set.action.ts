// Copyright 2021 Prescryptive Health, Inc.

import { IShoppingAction } from './shopping.action';

export type IOrderDateSetAction = IShoppingAction<'ORDER_DATE_SET', Date>;

export const orderDateSetAction = (orderDate: Date): IOrderDateSetAction => ({
  type: 'ORDER_DATE_SET',
  payload: orderDate,
});
