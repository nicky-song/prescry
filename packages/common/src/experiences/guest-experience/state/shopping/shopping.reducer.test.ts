// Copyright 2021 Prescryptive Health, Inc.

import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../../__mocks__/pharmacy-drug-price.mock';
import { prescriptionInfoMock } from '../../__mocks__/prescription-info.mock';
import { orderDateSetAction } from './actions/order-date-set.action';
import { prescriptionInfoSetAction } from './actions/prescription-info-set.action';
import { prescriptionPharmaciesSetAction } from './actions/prescription-pharmacies-set.action';
import { shoppingReducer } from './shopping.reducer';
import { defaultShoppingState, IShoppingState } from './shopping.state';

describe('shoppingReducer', () => {
  it('reduces order date set action', () => {
    const orderDateMock = new Date();
    const action = orderDateSetAction(orderDateMock);

    const initialState: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: { ...prescriptionInfoMock, orderDate: undefined },
    };
    const reducedState = shoppingReducer(initialState, action);

    const expectedState: IShoppingState = {
      ...initialState,
      prescriptionInfo: { ...prescriptionInfoMock, orderDate: orderDateMock },
    };
    expect(reducedState).toEqual(expectedState);
  });

  it('reduces prescription info set action', () => {
    const action = prescriptionInfoSetAction(prescriptionInfoMock);

    const initialState: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: undefined,
    };
    const reducedState = shoppingReducer(initialState, action);

    const expectedState: IShoppingState = {
      ...initialState,
      prescriptionInfo: prescriptionInfoMock,
    };
    expect(reducedState).toEqual(expectedState);
  });

  it('reduces prescription pharmacies set action', () => {
    const pharmaciesMock = [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock];
    const action = prescriptionPharmaciesSetAction(pharmaciesMock);

    const initialState: IShoppingState = {
      ...defaultShoppingState,
      prescriptionPharmacies: [],
    };
    const reducedState = shoppingReducer(initialState, action);

    const expectedState: IShoppingState = {
      ...initialState,
      prescriptionPharmacies: pharmaciesMock,
    };
    expect(reducedState).toEqual(expectedState);
  });
});
