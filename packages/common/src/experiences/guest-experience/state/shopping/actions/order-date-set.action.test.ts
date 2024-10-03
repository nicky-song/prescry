// Copyright 2021 Prescryptive Health, Inc.

import { orderDateSetAction } from './order-date-set.action';

describe('orderDateSetAction', () => {
  it('returns action', () => {
    const orderDateMock = new Date();
    const action = orderDateSetAction(orderDateMock);
    expect(action.type).toEqual('ORDER_DATE_SET');

    expect(action.payload).toEqual(orderDateMock);
  });
});
