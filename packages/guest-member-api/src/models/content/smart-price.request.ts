// Copyright 2021 Prescryptive Health, Inc.

export interface ISmartPriceLookupRequest {
  providerIds: string[];
  date: string;
  quantity: number;
  daysSupply: number;
}
