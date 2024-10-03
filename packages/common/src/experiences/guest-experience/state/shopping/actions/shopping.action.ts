// Copyright 2021 Prescryptive Health, Inc.

import { IShoppingState } from '../shopping.state';

type ActionKeys =
  | 'PRESCRIPTION_INFO_SET'
  | 'PRESCRIPTION_LOCATION_SET'
  | 'PRESCRIPTION_PHARMACIES_SET'
  | 'PRESCRIPTION_ZIPCODE_SET'
  | 'ORDER_DATE_SET'
  | 'SET_NO_PHARMACY_ERROR'
  | 'SET_IS_GETTING_PHARMACIES'
  | 'SET_LOCATION_DENIED_ERROR_MESSAGE'
  | 'SET_ALTERNATIVE_DRUG_SEARCH_RESULTS'
  | 'SET_HAS_INSURANCE';

export interface IShoppingAction<T extends ActionKeys, TPayload = unknown> {
  readonly type: T;
  readonly payload: Partial<IShoppingState> | TPayload;
}

export type ShoppingAction = IShoppingAction<ActionKeys>;
