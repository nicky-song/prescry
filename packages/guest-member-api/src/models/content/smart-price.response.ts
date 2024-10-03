// Copyright 2021 Prescryptive Health, Inc.

export interface ISmartPriceRebatePrice {
  SubTotal: number;
  RebatedUnitPrice: number;
  RebatedSubTotal: number;
  RebateTotal: number;
  RebatedTotalCost: number;
}
export interface ISmartPriceProviderPrice {
  ProviderId: string;
  PriceListId: string;
  Price: ISmartPriceRebatePrice;
}

export interface ISmartPriceError {
  statusCode: number;
  error: string;
  message: string;
}
