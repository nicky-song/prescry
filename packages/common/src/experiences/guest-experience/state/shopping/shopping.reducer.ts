// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'react';
import { IPrescriptionInfo } from '../../../../models/prescription-info';
import { ShoppingAction } from './actions/shopping.action';
import { IShoppingState } from './shopping.state';

export type ShoppingReducer = Reducer<IShoppingState, ShoppingAction>;

export const shoppingReducer: ShoppingReducer = (
  state: IShoppingState,
  action: ShoppingAction
): IShoppingState => {
  const { payload, type } = action;
  switch (type) {
    case 'ORDER_DATE_SET': {
      const prescriptionInfo = state.prescriptionInfo;
      if (!prescriptionInfo) {
        break;
      }

      const orderDate = payload as Date;
      const updatedPrescriptionInfo: IPrescriptionInfo = {
        ...prescriptionInfo,
        orderDate,
      };
      return { ...state, prescriptionInfo: updatedPrescriptionInfo };
    }
  }
  return { ...state, ...(payload as Partial<IShoppingState>) };
};
