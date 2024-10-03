// Copyright 2021 Prescryptive Health, Inc.

import { ISmartPriceProviderPrice } from '../models/content/smart-price.response';

export const smartPricePharmacyPriceMock1: ISmartPriceProviderPrice = {
  ProviderId: '4902234',
  PriceListId: 'list1',
  Price: {
    SubTotal: 5.0,
    RebatedUnitPrice: 1,
    RebatedSubTotal: 20,
    RebateTotal: 10,
    RebatedTotalCost: 33.7,
  },
};

export const smartPricePharmacyPriceMock2: ISmartPriceProviderPrice = {
  ProviderId: '4921575',
  PriceListId: 'list1',
  Price: {
    SubTotal: 5.0,
    RebatedUnitPrice: 1,
    RebatedSubTotal: 20,
    RebateTotal: 10,
    RebatedTotalCost: 34,
  },
};

export const smartPricePharmacyPriceMock3: ISmartPriceProviderPrice = {
  ProviderId: '3845798',
  PriceListId: 'list1',
  Price: {
    SubTotal: 5.0,
    RebatedUnitPrice: 1,
    RebatedSubTotal: 20,
    RebateTotal: 10,
    RebatedTotalCost: 35,
  },
};

export const smartPricePharmacyPriceMock4: ISmartPriceProviderPrice = {
  ProviderId: '3815341',
  PriceListId: 'list1',
  Price: {
    SubTotal: 5.0,
    RebatedUnitPrice: 1,
    RebatedSubTotal: 20,
    RebateTotal: 10,
    RebatedTotalCost: 34,
  },
};
